import { compact, isEmpty, reduce } from 'lodash';

import { ENCHANT_SLOTS_BY_RARITY } from 'engine/data/dataMappings';
import EnchantsPoolData from 'engine/data/enchantsPool.json';
import { allEnumValues } from 'helpers/typeUtils';
import { ItemEnchantSlots, SimpleEnchant, EnchantCategory, EnchantType, Enchant, CraftableEnchantTypes, EnchantsPool, EnchantPoolType } from 'types/Enchant.types';
// import { EnchantsFilters } from 'types/Filters.types';
import { ItemRarity, Item, ItemType } from 'types/Item.types';

import Engine, { DataInterface } from './Engine';

type HydratedPoolType = Record<CraftableEnchantTypes, Enchant[]>
type HydratedEnchantsPool = Record<ItemType, HydratedPoolType>;

export default class EngineEnchants {
  public readonly engine: Engine;
  public categories: EnchantCategory[];
  public types: EnchantType[];
  private enchantsPool!: HydratedEnchantsPool;

  constructor(engine: Engine) {
    this.engine = engine;
    this.categories = allEnumValues(EnchantCategory);
    this.types = allEnumValues(EnchantType);
  }

  public onDataLoaded() {
    this.enchantsPool = this.hydrateEnchantsPool();
  }

  public getItemEnchantsPool(item: Item): HydratedPoolType | null {
    return this.enchantsPool[item.type] || null;
  }

  public getItemEnchantsSlots(item: Item): ItemEnchantSlots | null {
    if (this.engine.loaded && ![ItemRarity.Mythical].includes(item.rarity)) {
      const enchantSlots = ENCHANT_SLOTS_BY_RARITY[item.rarity];
      const fixedEnchants = this.enchantsToRawEnchants(item.rarity, item.fixedEnchants);
      const baseEnchants = this.enchantsToRawEnchants(item.rarity, item.baseEnchants);

      if (isEmpty(enchantSlots) && isEmpty(fixedEnchants) && isEmpty(baseEnchants)) {
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

  /* Private utils */
  private enchantsToRawEnchants(rarity: ItemRarity, enchantsIds: number[]): SimpleEnchant[] {
    const { skills } = this.data;

    return compact(
      enchantsIds.map(enchantId => this.enchants.find(e => e.uuid === enchantId))
    ).map((enchant) => {
      const ranges = enchant.ranges[rarity];

      return {
        name: enchant.name,
        description: enchant.description,
        min: ranges.minimum,
        max: ranges.cap,
        skills: enchant.skills?.reduce((memo: Record<number, string>, skillId) => {
          const skill = skills.find(s => s.uuid === skillId);
          memo[skillId] = skill?.name || 'Unknown Skill';
          return memo;
        }, {}),
      };
    });
  }

  private hydrateEnchantsPool(): HydratedEnchantsPool {
    const enchantsPool = EnchantsPoolData as unknown as EnchantsPool;

    // @ts-ignore
    return reduce(enchantsPool, (hydratedPool: HydratedEnchantsPool, poolByEnchantType: EnchantPoolType, itemType: ItemType) => {
      hydratedPool[itemType] = {
        [EnchantType.Epic]: compact(poolByEnchantType[EnchantType.Epic].map(uuid => this.enchants.find(e => e.uuid === uuid))),
        [EnchantType.Major]: compact(poolByEnchantType[EnchantType.Major].map(uuid => this.enchants.find(e => e.uuid === uuid))),
        [EnchantType.Minor]: compact(poolByEnchantType[EnchantType.Minor].map(uuid => this.enchants.find(e => e.uuid === uuid))),
      };
      return hydratedPool;
    }, {});
  }
}
