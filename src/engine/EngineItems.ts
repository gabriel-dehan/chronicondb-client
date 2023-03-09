import { compact, findKey } from 'lodash';
import Minisearch from 'minisearch';

import { ITEM_TYPES_BY_CATEGORIES } from 'engine/data/dataMappings';
import { allEnumValues } from 'helpers/typeUtils';
import { CharacterClass } from 'types/Character.types';
import { ItemsFilters, SortOrder } from 'types/Filters.types';
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

export const ITEM_TYPES_WITH_EPIC_REPLACEMENT_CHANCE = [
  ItemType.Armor,
  ItemType.Boots,
  ItemType.Bow,
  ItemType.Sword,
  ItemType.Fists,
  ItemType.Staff,
  ItemType.Accessory,
];

export default class EngineItems {
  public readonly engine: Engine;
  public categories: ItemCategory[];
  public types: ItemType[];
  public typesByCategories: Record<ItemCategory, ItemType[]>;
  public categoriesByType: Record<ItemType, ItemCategory>;
  private searchEngine: Minisearch;

  constructor(engine: Engine) {
    this.engine = engine;
    this.types = allEnumValues(ItemType);
    this.categories = allEnumValues(ItemCategory);
    this.typesByCategories = ITEM_TYPES_BY_CATEGORIES;
    this.categoriesByType = this._categoriesByType();
    this.searchEngine = new Minisearch({
      idField: 'uuid',
      fields: ['name', 'classRestriction', 'enchants', 'setName', 'setBonuses'],
      storeFields: ['uuid'],
    });
  }

  public onDataLoaded() {
    this.searchEngine.removeAll();
    this.searchEngine.addAll(this.data.itemsSearchIndex);
  }

  /* Methods */
  public all(filters: ItemsFilters): Item[] {
    let items = this.items;

    items = this.filterBySearch(items, filters);
    items = this.filterByTypeAndCategory(items, filters);
    items = this.filterByClass(items, filters);
    items = this.filterByRarities(items, filters);
    items = this.filterOnlySet(items, filters);
    items = this.sortBy(items, filters);

    return items;
  }

  public find(uuid: number): Item | null {
    return this.items.find(item => item.uuid === uuid) || null;
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
  private filterBySearch(items: Item[], filters: ItemsFilters) {
    if (filters.search) {
      const resultingUuids = this.searchEngine.search(filters.search, {
        prefix: true,
        combineWith: 'AND',
      }).map(r => r.uuid);

      return items.filter(item => resultingUuids.includes(item.uuid));
    }

    return items;
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

  private sortBy(items: Item[], filters: ItemsFilters) {
    if (!filters.orderBy) {
      // Default sort is LevelDesc
      return items.sort((a, b) => a.minLevel - b.minLevel);
    }

    switch (filters.orderBy) {
      case SortOrder.NameAsc:
        return items.sort((a, b) => {
          const [nameA, nameB] = [a.name.toUpperCase(), b.name.toUpperCase()];
          return nameA < nameB ? -1 : 1;
        });
      case SortOrder.NameDesc:
        return items.sort((a, b) => {
          const [nameA, nameB] = [a.name.toUpperCase(), b.name.toUpperCase()];
          return nameA < nameB ? 1 : -1;
        });
      case SortOrder.LevelAsc:
        return items.sort((a, b) => a.minLevel - b.minLevel);
      case SortOrder.LevelDesc:
        return items.sort((a, b) => -(a.minLevel - b.minLevel));
      default:
        return items;
    }
  }

  private _categoriesByType(): Record<ItemType, ItemCategory> {
    // @ts-ignore
    return this.types.reduce((memo: Record<ItemType, ItemCategory>, type) => {
      memo[type] = findKey(this.typesByCategories, types =>
        types.includes(type)
      ) as ItemCategory;

      return memo;
    }, {});
  }
}
