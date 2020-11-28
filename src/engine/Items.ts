import { compact } from 'lodash';

import { ITEM_TYPES_BY_CATEGORIES, ENCHANT_SLOTS_BY_RARITY } from 'engine/data/dataMappings';
import enchantsPool from 'engine/data/enchantsPool.json';
import { allEnumValues } from 'helpers/typeUtils';
import { CharacterClass } from 'types/Character.types';
import { ItemEnchantSlots, RawEnchant } from 'types/Enchant.types';
import { ItemsFilters } from 'types/Filters.types';
import { ItemCategory, ItemType, ItemRarity, Item } from 'types/Item.types';

import Engine, { DataInterface } from './Engine';

const FILTER_UNAFFECTED_CATEGORIES = [
  'Any',
  ItemCategory.Consumables,
  ItemCategory.Craft,
  ItemCategory.Gem,
  ItemCategory.Misc,
];

export default class EngineItems {
  public readonly engine: Engine;
  public categories: ItemCategory[];
  public typesByCategories: Record<ItemCategory, ItemType[]>;

  constructor(engine: Engine) {
    this.engine = engine;
    this.categories = allEnumValues(ItemCategory);
    this.typesByCategories = ITEM_TYPES_BY_CATEGORIES;
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }

  private get items(): Item[] {
    if (this.engine.loaded) {
      return this.data.items;
    }

    return [];
  }

  public get defaultCategory(): ItemCategory {
    return this.categories[0];
  }

  public get defaultType(): ItemType {
    return this.typesByCategories[this.defaultCategory][0];
  }

  /* Methods */
  public all(filters: ItemsFilters): Item[] {
    let items = this.items;

    items = this.filterByTypeAndCategory(items, filters);
    items = this.filterByClass(items, filters);
    items = this.filterByRarities(items, filters);

    return items;
  }

  public getEnchantsSlots(item: Item): ItemEnchantSlots | null {
    if (this.engine.loaded && ![ItemRarity.Ordinary, ItemRarity.Set, ItemRarity.Mythical].includes(item.rarity)) {
      const enchantSlots = ENCHANT_SLOTS_BY_RARITY[item.rarity];
      const fixedEnchants = this.enchantsToRawEnchants(item.rarity, item.fixedEnchants);
      const baseEnchants = this.enchantsToRawEnchants(item.rarity, item.baseEnchants);

      return {
        enchantSlots,
        fixedEnchants,
        baseEnchants,
      };
    }

    return null;
  }

  /* Private utils */
  private enchantsToRawEnchants(rarity: ItemRarity, enchantsIds: number[]): RawEnchant[] {
    const { enchants } = this.data;

    return compact(
      enchantsIds.map(enchantId => enchants.find(e => e.uuid === enchantId))
    ).map((enchant) => {
      // @ts-ignore
      const ranges = enchant.ranges[rarity];
      return {
        name: enchant.name,
        min: ranges.minimum,
        max: ranges.cap,
      };
    });
  }

  private filterByTypeAndCategory(items: Item[], filters: ItemsFilters) {
    if (filters.category === 'Any' || filters.type === 'Any') {
      return items;
    } else {
      const category = (filters.category || this.defaultCategory) as ItemCategory;
      const type = (filters.type || this.defaultType) as ItemType;

      return items.filter(item => item.type === type && item.category === category);
    }
  }

  private filterByClass(items: Item[], filters: ItemsFilters) {
    // If we have a category and it's a category that should not be affected by rarity
    if (filters.category && FILTER_UNAFFECTED_CATEGORIES.includes(filters.category)) {
      return items;
    }

    // For all others categories, filter by rarity
    if (filters.characterClass && filters.characterClass !== CharacterClass.All) {
      return items.filter(item => filters.characterClass === item.classRestriction);
    }

    return items;
  }

  private filterByRarities(items: Item[], filters: ItemsFilters) {
    // If we have a category and it's a category that should not be affected by rarity
    if (filters.category && FILTER_UNAFFECTED_CATEGORIES.includes(filters.category)) {
      return items;
    }

    // For all others categories, filter by rarity
    if (filters.rarities) {
      return items.filter(item => filters.rarities?.includes(item.rarity));
    }

    return items;
  }
}
