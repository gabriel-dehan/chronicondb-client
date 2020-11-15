import { compact, capitalize } from 'lodash';

import { Enchant, EnchantRanges, EnchantRangeBoundary, EnchantType, EnchantCategory } from '../../types/Enchant.types';
import { Item, ItemRarity } from '../../types/Item.types';
import { readSourceFile, readExtractFile, writeFile } from '../utils/fileUtils';
import { getLocaleSection, parseLocaleData, LocaleData } from './parseLocale';

interface EnchantsLocaleData {
  powerLocales: LocaleData;
  enchantLocales: LocaleData;
  runesLocales: LocaleData;
  gemsLocales: LocaleData;
}

export function parseEnchants(version: string, verbose = false): Enchant[] {
  let itemsData: Item[] = [];
  try {
    itemsData = JSON.parse(readExtractFile(version, 'items')) as Item[];
  } catch (e) {
    throw `ERROR: src/engine/data/${version}/extracts/items.json could not be found. Generate the file before parsing the enchants.`;
  }

  const rawEnchants = compact(readSourceFile(version, 'enchantlist.txt').split(/\n|\r/));
  const locales = parseLocale(version);
  const localesByCategory = {
    [EnchantCategory.Power]: locales.powerLocales,
    [EnchantCategory.Enchant]: locales.enchantLocales,
    [EnchantCategory.Gem]: locales.gemsLocales,
    [EnchantCategory.Rune]: locales.runesLocales,
  };

  const enchants: Enchant[] = rawEnchants.map((rawEnchant): Enchant => {
    const [id, name, rawRanges, rawType] = rawEnchant.split(' - ').map(data => data.trim());
    const uuid = parseInt(id);
    const category = findCategory(uuid, locales);
    const locale = localesByCategory[category];
    const ranges = parseRanges(rawRanges);
    const type = capitalize(rawType.replace(/\(|\)/g, '')) as EnchantType;
    const affixes = getAffixes(uuid, locale);
    const items = findItems(uuid, itemsData);

    const enchant = {
      uuid,
      name,
      category,
      type,
      affixes,
      description: locale[uuid].txt,
      ranges,
      items,
    };

    if (verbose) {
      console.log(enchant);
    }

    return enchant;
  });

  writeFile(enchants, version, 'enchants');

  return enchants;
}

function findCategory(uuid: number, locales: EnchantsLocaleData): EnchantCategory {
  // Check if we find the enchant ID inside any of the locales sections
  if (locales.enchantLocales[uuid]) {
    return EnchantCategory.Enchant;
  } else if (locales.powerLocales[uuid]) {
    return EnchantCategory.Power;
  } else if (locales.gemsLocales[uuid]) {
    return EnchantCategory.Gem;
  } else if (locales.runesLocales[uuid]) {
    return EnchantCategory.Rune;
  }

  return EnchantCategory.Enchant;
}

function parseRanges(ranges: string): EnchantRanges {
  // Gives us the order in which rarities are defined in `minimumByRarity`, `maximumByRarity`, etc...
  const rarities = [ItemRarity.Enchanted, ItemRarity.Rare, ItemRarity.Unique, ItemRarity.Legendary, ItemRarity.TrueLegendary];

  const [
    minimumByRarity,
    maximumByRarity,
    capByRarity,
    greaterCap,
  ] = ranges.split(',')
    .map(range => range
      .trim()
      .split('/')
      .map(value => parseInt(value))
    );

  const boundariesForRarity = (rarity: ItemRarity): EnchantRangeBoundary => {
    const rarityIndex = rarities.indexOf(rarity);

    return {
      minimum: minimumByRarity[rarityIndex],
      maximum: maximumByRarity[rarityIndex],
      cap: capByRarity[rarityIndex],
      greaterCap: greaterCap[0],
    };
  };

  return {
    [ItemRarity.Enchanted]: boundariesForRarity(ItemRarity.Enchanted),
    [ItemRarity.Rare]: boundariesForRarity(ItemRarity.Rare),
    [ItemRarity.Unique]: boundariesForRarity(ItemRarity.Unique),
    [ItemRarity.Legendary]: boundariesForRarity(ItemRarity.Legendary),
    [ItemRarity.TrueLegendary]: boundariesForRarity(ItemRarity.TrueLegendary),
  };
}

function getAffixes(uuid: number, locale: LocaleData): string[] | undefined {
  const affixes = compact([locale[uuid].fix1, locale[uuid].fix1]);

  return affixes.length > 0 ? affixes : undefined;
}

function findItems(uuid: number, items: Item[]): number[] {
  return items
    .filter(item => item.baseEnchants.includes(uuid))
    .map(item => item.uuid);
}

function parseLocale(version: string): EnchantsLocaleData {
  const parser = /^enchant_(\d+)_(\w+)$/;
  const localePowerData = getLocaleSection(version, 'locale/EN/enchants', 'power');
  const localeEnchantData = getLocaleSection(version, 'locale/EN/enchants', 'enchant');
  const localeGemsData = getLocaleSection(version, 'locale/EN/enchants', 'gems');
  const localeRunesData = getLocaleSection(version, 'locale/EN/enchants', 'runes');

  const powerLocales = parseLocaleData(localePowerData, parser);
  const enchantLocales = parseLocaleData(localeEnchantData, parser);
  const runesLocales = parseLocaleData(localeGemsData, parser);
  const gemsLocales = parseLocaleData(localeRunesData, parser);

  return {
    powerLocales,
    enchantLocales,
    runesLocales,
    gemsLocales,
  };

}