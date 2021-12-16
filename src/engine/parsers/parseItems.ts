import { compact, findKey } from 'lodash';

import { CharacterClass } from '../../types/Character.types';
import { Item, ItemCategory, ItemRarity, ItemType, SetUuid } from '../../types/Item.types';
import { ITEM_TYPES_BY_CATEGORIES, ITEM_ID_BY_SETS } from '../data/dataMappings';
import { readSourceFile, writeFile, assetExists } from '../utils/fileUtils';
import { getLocaleSection, parseLocaleData, LocaleData } from './parseLocale';

interface ItemMetaData {
  rarity: ItemRarity,
  type: ItemType,
  category: ItemCategory,
}

export function parseItems(version: string, verbose = false): Item[] {
  const rawItems = compact(readSourceFile(version, 'itemlist.txt').split(/\n|\r/));
  const itemLocales = parseLocale(version);

  const items: Item[] = rawItems.map((rawItem): Item => {
    const [itemData, enchantsData] = rawItem.split(' -- ');
    const [id, name, typeAndRarity, rawClassRestriction, rawMinLevel] = itemData.split(' - ').map(data => data.trim());

    const hasIcon = assetExists(`items/all/spr_itemicons_${id}.png`);
    const icon = hasIcon ? `spr_itemicons_${id}` : null;
    const uuid = parseInt(id);
    const classRestriction = parseClassRestriction(rawClassRestriction);
    const set = findSet(uuid);
    const minLevel = parseInt(rawMinLevel.replace(/Lv\s/, ''));
    const { rarity, type, category } = parseMetaData(typeAndRarity);
    const baseEnchants = findBaseEnchants(category);
    const fixedEnchants = parseFixedEnchants(enchantsData);

    const item = {
      uuid,
      name: itemLocales[uuid]?.name,
      icon,
      flavor: itemLocales[uuid]?.flavor,
      description: itemLocales[uuid]?.txt,
      category,
      type,
      rarity,
      classRestriction,
      minLevel,
      baseEnchants,
      fixedEnchants,
      set,
    };

    if (verbose) {
      console.log(item);
    }

    return item;
  });

  writeFile(items, version, 'items');

  return items;
}

function parseClassRestriction(classData: string): CharacterClass | null {
  return classData === 'Any Class'
    ? null
    : classData as CharacterClass;
}

function parseFixedEnchants(enchantsData: string): number[] {
  return enchantsData
    ? compact(enchantsData.split(/\s/).map(enchant => enchant.replace(/e/g, ''))).map(id => parseInt(id))
    : [];
}

function findBaseEnchants(category: ItemCategory): number[] {
  const coreEnchants = [1, 2, 3];
  const weaponEnchants = [5, 19];

  switch (category) {
    case ItemCategory.Helmet:
      return coreEnchants;
    case ItemCategory.Armor:
      return coreEnchants;
    case ItemCategory.Boots:
      return coreEnchants;
    case ItemCategory.Weapon:
      return [...coreEnchants, ...weaponEnchants];
    case ItemCategory.Offhand:
      return coreEnchants;
    case ItemCategory.Ring:
      return coreEnchants;
    case ItemCategory.Amulet:
      return coreEnchants;
    case ItemCategory.Accessory:
      return coreEnchants;
    default:
      return [];
  }
}

function parseMetaData(typeAndRarity: string): ItemMetaData {
  const rarityAndTypeRegexp = /^(Ordinary|Common|Enchanted|Rare|Unique|Legendary|True\sLegendary|Mythical)\s((?:\w|\s)+)\s?(\(Offhand\))?$/;
  const match = typeAndRarity.match(rarityAndTypeRegexp);

  if (!match) {
    throw (`Couldn't parse ${typeAndRarity}`);
  }

  const rarity = match[1].trim() as ItemRarity;
  const type = match[2].trim() as ItemType;
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

  if (category) {
    return category;
  } else if (type.match(/Gem/)) {
    return ItemCategory.Gem;
  } else {
    return ItemCategory.Misc;
  }
}

function findSet(uuid: number): SetUuid | null {
  const set = findKey(ITEM_ID_BY_SETS, (itemIds) => {
    return itemIds.includes(uuid);
  }) as SetUuid;

  return set;
}

function parseLocale(version: string): LocaleData  {
  const localeData = getLocaleSection(version, 'locale/CN/items', 'items');
  return parseLocaleData(localeData, /^item_(\d+)_(\w+)$/);
}
