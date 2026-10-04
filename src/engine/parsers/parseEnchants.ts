import { compact, capitalize, uniq } from 'lodash';

import { allEnumValues } from '../../helpers/typeUtils';
import { CharacterClass } from '../../types/Character.types';
import { Enchant, EnchantRanges, EnchantRangeBoundary, EnchantType, EnchantCategory, RuneRestrictions } from '../../types/Enchant.types';
import { Item, ItemCategory, ItemRarity, ItemType } from '../../types/Item.types';
import { readSourceFile, readInjectedSourceFile, readExtractFile, writeFile } from '../utils/fileUtils';
import { getLocaleSection, parseLocaleData, LocaleData } from './parseLocale';

// The game's data export doesn't list where runes can roll, so this comes from
// Chronomancer's droppedRunes.json (https://github.com/iconmaster5326/Chronomancer)
interface DroppedRune {
  uuid: number;
  class: CharacterClass | null;
  categories: ItemCategory[];
}

interface EnchantsLocaleData {
  powerLocales: LocaleData;
  enchantLocales: LocaleData;
  runesLocales: LocaleData;
  gemsLocales: LocaleData;
}

export function parseEnchants(version: string, verbose = false): Enchant[] {
  // Get item data
  let itemsData: Item[] = [];
  try {
    itemsData = JSON.parse(readExtractFile(version, 'items')) as Item[];
  } catch (e) {
    throw `ERROR: src/engine/data/${version}/extracts/items.json could not be found. Generate the file before parsing the enchants.`;
  }

  const rawItemsEnchants = compact(readSourceFile(version, 'enchantlist.txt').split(/\n|\r/));
  const rawGemEnchants = compact(readInjectedSourceFile(version, 'gemenchantlist.txt').split(/\n|\r/));
  const rawEnchants = [...rawGemEnchants, ...rawItemsEnchants];
  const droppedRunes: DroppedRune[] = JSON.parse(readInjectedSourceFile(version, 'droppedRunes.json'));

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
    const ranges = parseRanges(rawRanges, category);
    const type = capitalize(rawType.replace(/\(|\)/g, '')) as EnchantType;
    const affixes = getAffixes(uuid, locale);
    const description = locale[uuid].txt;
    const items = findItems(uuid, itemsData);
    const itemTypes = findItemTypes(uuid, type, category, version);
    const skills = findSkills(description);
    const rune = category === EnchantCategory.Rune ? findRuneRestrictions(uuid, droppedRunes) : undefined;

    const enchant = {
      uuid,
      name,
      category,
      type,
      affixes,
      description,
      ranges,
      items,
      itemTypes,
      skills,
      rune,
    };

    if (verbose) {
      console.log(enchant);
    }

    return enchant;
  })
    // runes that aren't in any drop pool can't be obtained
    .filter(enchant => enchant.category !== EnchantCategory.Rune || enchant.rune);
  // enchants = enchants.filter(({ name }) => name.includes('GEM'));
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

function parseRanges(ranges: string, category: EnchantCategory): EnchantRanges {
  // Gives us the order in which rarities are defined in `minimumByRarity`, `maximumByRarity`, etc...
  // The game exports item enchants for item qualities 0-4 (Ordinary to Legendary). True Legendary
  // items are Legendary quality and roll the same ranges.
  const rarities = category === EnchantCategory.Gem ?
    [ItemRarity.Ordinary, ItemRarity.Enchanted, ItemRarity.Rare] :
    [ItemRarity.Ordinary, ItemRarity.Enchanted, ItemRarity.Rare, ItemRarity.Unique, ItemRarity.Legendary];

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
      maximum: maximumByRarity == null ? minimumByRarity[rarityIndex] : maximumByRarity[rarityIndex],
      cap: capByRarity == null ? minimumByRarity[rarityIndex] : capByRarity[rarityIndex],
      greaterCap: greaterCap == null ? minimumByRarity[rarityIndex] : greaterCap[0],
    };
  };

  // Gems only have Ordinary - Enchanted - Rare.
  if (category === EnchantCategory.Gem) {
    return {
      [ItemRarity.Ordinary]: boundariesForRarity(ItemRarity.Ordinary),
      [ItemRarity.Enchanted]: boundariesForRarity(ItemRarity.Enchanted),
      [ItemRarity.Rare]: boundariesForRarity(ItemRarity.Rare),
      [ItemRarity.Unique]: boundariesForRarity(ItemRarity.Rare),
      [ItemRarity.Legendary]: boundariesForRarity(ItemRarity.Rare),
      [ItemRarity.TrueLegendary]: boundariesForRarity(ItemRarity.Rare),
      [ItemRarity.Mythical]: boundariesForRarity(ItemRarity.Rare),
    };
  } else {
    const legendary = boundariesForRarity(ItemRarity.Legendary);

    return {
      [ItemRarity.Ordinary]: boundariesForRarity(ItemRarity.Ordinary),
      [ItemRarity.Enchanted]: boundariesForRarity(ItemRarity.Enchanted),
      [ItemRarity.Rare]: boundariesForRarity(ItemRarity.Rare),
      [ItemRarity.Unique]: boundariesForRarity(ItemRarity.Unique),
      [ItemRarity.Legendary]: legendary,
      [ItemRarity.TrueLegendary]: legendary,
      // The export's last number is the Mythical cap, which is also the Greater Augmentation cap.
      // Mythical roll ranges aren't exported, so those are left at the Legendary ones.
      [ItemRarity.Mythical]: { ...legendary, cap: legendary.greaterCap },
    };
  }
}

function getAffixes(uuid: number, locale: LocaleData): string[] | undefined {
  const affixes = compact([locale[uuid].fix1, locale[uuid].fix1]);

  return affixes.length > 0 ? affixes : undefined;
}

function findItems(uuid: number, items: Item[]): number[] {
  return items
    .filter(item => item.fixedEnchants.includes(uuid))
    .map(item => item.uuid);
}

function findItemTypes(uuid: number, type: EnchantType, category: EnchantCategory, version: string): ItemType[] {
  // Get enchants pool
  // @ts-ignore
  let pool: Record<ItemType, Record<EnchantType, number[]>> = {};
  try {
    pool = JSON.parse(readExtractFile(version, 'enchantsPool'));
  } catch (e) {
    throw `ERROR: src/engine/data/${version}/extracts/enchantsPool.json could not be found. Generate the file before parsing the enchants.`;
  }

  const itemTypes = allEnumValues(ItemType).filter((itemType: ItemType) => {
    const enchants = pool[itemType] && pool[itemType][type];

    return enchants ?
      !!enchants.find(enchantUuid => enchantUuid === uuid)
      : false;
  });

  if (category === EnchantCategory.Gem) {
    itemTypes.push(ItemType.CubeGem);
    itemTypes.push(ItemType.SphereGem);
    itemTypes.push(ItemType.StarGem);
  } else if (category === EnchantCategory.Rune || category === EnchantCategory.Power) {
    itemTypes.push(ItemType.Rune);
  }

  return itemTypes;
}

function findRuneRestrictions(uuid: number, droppedRunes: DroppedRune[]): RuneRestrictions | undefined {
  const droppedRune = droppedRunes.find(rune => rune.uuid === uuid);
  if (!droppedRune) {
    return undefined;
  }

  return {
    characterClass: droppedRune.class ?? undefined,
    categories: droppedRune.categories,
  };
}

function findSkills(description: string): number[] | undefined {
  const skillsMatches = [...description.matchAll(/<SKILL_(\d+)>/g)].map(m => parseInt(m[1]));
  return skillsMatches.length > 0 ? uniq(skillsMatches) : undefined;
}

function parseLocale(version: string): EnchantsLocaleData {
  const parser = /^enchant_(\d+)_(\w+)$/;
  const localePowerData = getLocaleSection(version, 'locale/EN/enchants', 'power');
  const localeEnchantData = getLocaleSection(version, 'locale/EN/enchants', 'enchant');
  const localeGemsData = getLocaleSection(version, 'locale/EN/enchants', 'gems');
  const localeRunesData = getLocaleSection(version, 'locale/EN/enchants', 'runes');

  const powerLocales = parseLocaleData(localePowerData, parser);
  const enchantLocales = parseLocaleData(localeEnchantData, parser);
  const runesLocales = parseLocaleData(localeRunesData, parser);
  const gemsLocales = parseLocaleData(localeGemsData, parser);

  return {
    powerLocales,
    enchantLocales,
    runesLocales,
    gemsLocales,
  };

}