import { compact } from 'lodash';

import { ITEM_TYPES_BY_CATEGORIES } from 'engine/data/dataMappings';
import { allEnumValues } from 'helpers/typeUtils';
import { CharacterClass } from 'types/Character.types';
import { ItemsFilters } from 'types/Filters.types';
import { ItemCategory, ItemType, Item, ItemRarity, ItemSet } from 'types/Item.types';

import Engine, { DataInterface } from './Engine';

export interface ItemSetData extends ItemSet {
  items: Item[];
  types: ItemType[];
}

export const DEFAULT_RARITIES_FILTERS = [
  ItemRarity.Unique,
  ItemRarity.Legendary,
  ItemRarity.TrueLegendary,
];

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

  /* Methods */
  public all(filters: ItemsFilters): Item[] {
    let items = this.items;

    items = this.filterByTypeAndCategory(items, filters);
    items = this.filterByClass(items, filters);
    items = this.filterByRarities(items, filters);
    items = this.filterOnlySet(items, filters);

    return items;
  }

  public getSetData(item: Item): ItemSetData | null {
    if (item.set) {
      const set = this.data.sets.find(set => set.uuid === item.set);

      if (set) {
        const setItems = compact(set.itemIds.map(itemId => this.items.find(item => item.uuid === itemId)));
        return {
          ...set,
          items: setItems,
          types: setItems.map(item => item.type),
        };
      }
    }

    return null;
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

  /* Private */
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
    // Don't use this filter for unaffected categories
    if (FILTER_UNAFFECTED_CATEGORIES.includes(filters.category || this.defaultCategory)) {
      // Don't return mythical items anyway if it is unselected
      if (!filters.rarities?.includes(ItemRarity.Mythical)) {
        return items.filter(item => item.rarity !== ItemRarity.Mythical);
      } else {
        return items;
      }
    }

    // For all others categories, filter by rarity
    if (filters.rarities) {
      return items.filter(item => filters.rarities?.includes(item.rarity));
    } else {
      return items.filter(item => DEFAULT_RARITIES_FILTERS.includes(item.rarity));
    }
  }

  private filterOnlySet(items: Item[], filters: ItemsFilters) {
    // Don't use this filter for unaffected categories
    if (FILTER_UNAFFECTED_CATEGORIES.includes(filters.category || this.defaultCategory)) {
      return items;
    }

    if (filters.onlySet) {
      return items.filter(item => !!item.set);
    }

    return items;
  }
}
