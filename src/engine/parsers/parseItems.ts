import { compact, findKey, reduce, isEmpty } from 'lodash';

import { CharacterClass } from '../../types/Character.types';
import { Item, ItemCategory, ItemRarity, ItemType, SetId } from '../../types/Item.types';
import { ITEM_TYPES_BY_CATEGORIES, ITEM_ID_BY_SETS } from '../data/dataMappings';
import { readFile, assetExists } from '../utils/fileUtils';
import { getLocaleSection } from './parseLocale';

interface ItemMetaData {
  rarity: ItemRarity,
  type: ItemType,
  category: ItemCategory,
}

export function parseItems(version: number, debug = false): Item[] {
  const rawItems = compact(readFile(version, 'itemlist.txt').split(/\n|\r/));
  const localeData = parseLocaleData(version);

  const items: Item[] = rawItems.map((rawItem): Item => {
    const [itemData, enchantsData] = rawItem.split(' -- ');
    const [id, name, typeAndRarity, rawClassRestriction, rawMinLevel] = itemData.split(' - ').map(data => data.trim());

    const hasIcon = assetExists(`items/all/spr_itemicons_${id}.png`);
    const icon = hasIcon ? `spr_itemicons_${id}.png` : null;
    const uuid = parseInt(id);
    const classRestriction = parseClassRestriction(rawClassRestriction);
    const baseEnchants = parseBaseEnchants(enchantsData);
    const set = findSet(uuid);
    const minLevel = parseInt(rawMinLevel.replace(/Lv\s/, ''));
    const { rarity, type, category } = parseMetaData(typeAndRarity);

    const item = {
      uuid,
      name,
      icon,
      flavor: localeData[uuid].flavor,
      description: localeData[uuid].txt,
      category,
      type,
      rarity,
      classRestriction,
      minLevel,
      baseEnchants,
      set,
    };

    if (debug) {
      console.log(item);
    }

    return item;
  });

  return items;
}

function parseClassRestriction(classData: string): CharacterClass | null {
  return classData === 'Any Class'
    ? null
    : classData.toLowerCase() as CharacterClass;
}

function parseBaseEnchants(enchantsData: string): number[] {
  return enchantsData
    ? compact(enchantsData.split(/\s/).map(enchant => enchant.replace(/e/g, ''))).map(id => parseInt(id))
    : [];
}

function parseMetaData(typeAndRarity: string): ItemMetaData {
  const rarityAndTypeRegexp = /^(Ordinary|Common|Enchanted|Rare|Unique|Legendary|True\sLegendary|Mythical)\s((?:\w|\s)+)\s?(\(Offhand\))?$/;
  const match = typeAndRarity.match(rarityAndTypeRegexp);

  if (!match) {
    throw (`Couldn't parse ${typeAndRarity}`);
  }

  const rarity = match[1] as ItemRarity;
  const type = match[2] as ItemType;
  const isOffhand = !!match[3];
  const category = isOffhand ? ItemCategory.Offhand : getCategoryFromType(type);

  return {
    rarity,
    type,
    category,
  };
}

function getCategoryFromType(type: ItemType): ItemCategory {
  const category = findKey(ITEM_TYPES_BY_CATEGORIES, (itemTypes) => {
    return itemTypes.includes(type);
  }) as ItemCategory;

  return category || ItemCategory.Misc;
}

function findSet(uuid: number): SetId | null {
  const set = findKey(ITEM_ID_BY_SETS, (itemIds) => {
    return itemIds.includes(uuid);
  }) as SetId;

  return set;
}

interface ItemLocaleData {
  [key: number]: Record<string, string>;
}

function parseLocaleData(version: number) {
  const localeData = getLocaleSection(version, 'locale/EN/items', 'items');

  return reduce(localeData, (itemData: ItemLocaleData, value, key) => {
    const matches = key.match(/^item_(\d+)_(\w+)$/);

    if (matches) {
      const itemId = parseInt(matches[1]);
      const keyName = matches[2];

      if (!itemData[itemId]) {
        itemData[itemId] = {};
      }

      if (!isEmpty(value)) {
        itemData[itemId][keyName] = value;
      }
    }

    return itemData;
  }, {});
}