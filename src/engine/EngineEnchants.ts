import { compact, isEmpty, reduce, uniq } from 'lodash';
import Minisearch from 'minisearch';

import { ENCHANT_SLOTS_BY_RARITY } from 'engine/data/dataMappings';
import { sortObject } from 'helpers/objectUtils';
import { allEnumValues } from 'helpers/typeUtils';
import {
  ItemEnchantSlots,
  SimpleEnchant,
  EnchantType,
  Enchant,
  EnchantCategory,
  CraftableEnchantTypes,
  EnchantPoolType,
} from 'types/Enchant.types';
import { EnchantsFilters } from 'types/Filters.types';
import { ItemRarity, Item, ItemType } from 'types/Item.types';

import Engine, { DataInterface } from './Engine';

type HydratedPoolType = Record<CraftableEnchantTypes, Enchant[]>;
type HydratedEnchantsPool = Record<ItemType, HydratedPoolType>;

export default class EngineEnchants {
  public readonly engine: Engine;
  public categories: EnchantCategory[];
  public types: EnchantType[];
  private _categoriesByTypes?: Record<EnchantType, EnchantCategory[]>;
  private enchantsPool!: HydratedEnchantsPool;
  private searchEngine: Minisearch;

  constructor(engine: Engine) {
    this.engine = engine;
    this.categories = allEnumValues(EnchantCategory);
    this.types = allEnumValues(EnchantType);
    this.searchEngine = new Minisearch({
      idField: 'uuid',
      fields: [
        'name',
        'category',
        'description',
        'itemTypes',
        'itemCategories',
      ],
      storeFields: ['uuid'],
    });
  }

  public onDataLoaded() {
    this.enchantsPool = this.hydrateEnchantsPool();
    this.searchEngine.removeAll();
    this.searchEngine.addAll(this.data.enchantsSearchIndex);
  }

  /* Methods */
  public all(filters: EnchantsFilters): Enchant[] {
    let enchants = this.enchants;

    enchants = this.filterBySearch(enchants, filters);
    enchants = this.filterByTypeAndCategory(enchants, filters);

    return enchants;
  }
  public getTypeEnchantsPool(type: ItemType): HydratedPoolType | null {
    return this.enchantsPool[type] || null;
  }

  public getRunesEnchantsPool(): Enchant[] {
    return this.enchants.filter(
      (enchant) => enchant.category === EnchantCategory.Rune
    );
  }

  public getItemEnchantsSlots(item: Item): ItemEnchantSlots | null {
    if (this.engine.loaded && ![ItemRarity.Mythical].includes(item.rarity)) {
      const enchantSlots = ENCHANT_SLOTS_BY_RARITY[item.rarity];
      const fixedEnchants = this.enchantsToRawEnchants(
        item.rarity,
        item.fixedEnchants
      );
      const baseEnchants = this.enchantsToRawEnchants(
        item.rarity,
        item.baseEnchants
      );

      if (
        isEmpty(enchantSlots) &&
        isEmpty(fixedEnchants) &&
        isEmpty(baseEnchants)
      ) {
        return null;
      } else {
        return {
          enchantSlots,
          fixedEnchants,
          baseEnchants,
        };
      }
    }

    return null;
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }

  private get enchants(): Enchant[] {
    if (this.engine.loaded) {
      return this.data.enchants;
    }

    return [];
  }

  public get defaultType(): EnchantType {
    return Object.keys(this.categoriesByTypes)[0] as EnchantType;
  }

  public get defaultCategory(): EnchantCategory {
    return this.categoriesByTypes[this.defaultType][0];
  }

  // TODO: Move this to a parser ?
  public get categoriesByTypes(): Record<EnchantType, EnchantCategory[]> {
    if (!this._categoriesByTypes) {
      const enchants = this.enchants.reduce(
        (memo: Record<string, string[]>, enchant: Enchant) => {
          if (
            enchant.type !== ('Gem' as EnchantType) &&
            enchant.category === EnchantCategory.Gem
          ) {
            return memo;
          }

          if (memo[enchant.type]) {
            memo[enchant.type].push(enchant.category);
            memo[enchant.type] = uniq(memo[enchant.type]);
          } else {
            memo[enchant.type] = [];
          }

          return memo;
        },
        {}
      );

      // enchants[EnchantType.Major].push(EnchantCategory.Gem);
      this._categoriesByTypes = sortObject(enchants, (a, b) => {
        if (a === EnchantType.Minor || b === EnchantType.Gem) {
          return 1;
        }

        return -1;
      }) as Record<EnchantType, EnchantCategory[]>;
    }

    return this._categoriesByTypes;
  }

  /* Private */
  private filterBySearch(enchants: Enchant[], filters: EnchantsFilters) {
    if (filters.search) {
      const resultingUuids = this.searchEngine
        .search(filters.search, {
          prefix: true,
          fuzzy: 0.2,
        })
        .map((r) => r.uuid);

      return enchants.filter((enchant) =>
        resultingUuids.includes(enchant.uuid)
      );
    }

    return enchants;
  }

  private filterByTypeAndCategory(
    enchants: Enchant[],
    filters: EnchantsFilters
  ) {
    if (filters.category === 'Any' || filters.type === 'Any') {
      return enchants;
    } else {
      const category = (filters.category ||
        this.defaultCategory) as EnchantCategory;
      const type = (
        category === EnchantCategory.Gem
          ? 'Gem'
          : filters.type || this.defaultType
      ) as EnchantType;

      return enchants.filter(
        (enchant) => enchant.type === type && enchant.category === category
      );
    }
  }

  /* Private utils */
  private enchantsToRawEnchants(
    rarity: ItemRarity,
    enchantsIds: number[]
  ): SimpleEnchant[] {
    const { skills } = this.data;

    return compact(
      enchantsIds.map((enchantId) =>
        this.enchants.find((e) => e.uuid === enchantId)
      )
    ).map((enchant) => {
      const ranges = enchant.ranges[rarity];

      return {
        uuid: enchant.uuid,
        name: enchant.name,
        description: enchant.description,
        min: ranges.minimum,
        max: ranges.cap,
        skills: enchant.skills?.reduce(
          (memo: Record<number, string>, skillId) => {
            const skill = skills.find((s) => s.uuid === skillId);
            memo[skillId] = skill?.name || 'Unknown Skill';
            return memo;
          },
          {}
        ),
      };
    });
  }

  private hydrateEnchantsPool(): HydratedEnchantsPool {
    const enchantsPool = this.data.enchantsPool;

    // @ts-ignore
    return reduce(
      enchantsPool,
      (
        hydratedPool: HydratedEnchantsPool,
        poolByEnchantType: EnchantPoolType,
        itemType: ItemType
      ) => {
        hydratedPool[itemType] = {
          [EnchantType.Epic]: compact(
            poolByEnchantType[EnchantType.Epic].map((uuid) =>
              this.enchants.find((e) => e.uuid === uuid)
            )
          ),
          [EnchantType.Major]: compact(
            poolByEnchantType[EnchantType.Major].map((uuid) =>
              this.enchants.find((e) => e.uuid === uuid)
            )
          ),
          [EnchantType.Minor]: compact(
            poolByEnchantType[EnchantType.Minor].map((uuid) =>
              this.enchants.find((e) => e.uuid === uuid)
            )
          ),
        };
        return hydratedPool;
      },
      {}
    );
  }
}
