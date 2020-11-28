import { ItemRarity, ItemCategory } from './Item.types';

export interface Enchant {
  uuid: number;
  name: string;
  category: EnchantCategory;
  type: EnchantType;
  affixes?: string[];
  description: string;
  ranges: EnchantRanges;
  items: number[];
}


export interface EnchantRanges {
  [ItemRarity.Enchanted]: EnchantRangeBoundary;
  [ItemRarity.Rare]: EnchantRangeBoundary;
  [ItemRarity.Unique]: EnchantRangeBoundary;
  [ItemRarity.Legendary]: EnchantRangeBoundary;
  [ItemRarity.TrueLegendary]: EnchantRangeBoundary;
}

export interface EnchantRangeBoundary {
  minimum: number;
  maximum: number;
  cap: number;
  greaterCap: number;
}

export enum EnchantType {
  Minor = 'Minor',
  Major = 'Major',
  Epic = 'Epic',
  Legendary = 'Legendary'
}

export enum EnchantCategory {
  Power = 'Power',
  Enchant = 'Enchant',
  Gem = 'Gem',
  Rune = 'Rune'
}

export interface RawEnchant {
  name: string;
  min: number;
  max: number;
}

export interface ItemRawEnchantCategory {
  count: number;
  types: EnchantType[]; // If multiple element it's an OR
  categoriesRestriction?: ItemCategory[];
}

export interface ItemEnchantSlots {
  baseEnchants: RawEnchant[];
  fixedEnchants: RawEnchant[];
  enchantSlots?: ItemRawEnchantCategory[];
}