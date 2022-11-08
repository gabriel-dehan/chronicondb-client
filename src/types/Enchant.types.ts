import { ItemRarity, ItemCategory, ItemType } from './Item.types';

export interface Enchant {
  uuid: number;
  name: string;
  category: EnchantCategory;
  type: EnchantType;
  affixes?: string[];
  description: string;
  ranges: EnchantRanges;
  items: number[];
  itemTypes: ItemType[];
  skills?: number[];
}

export interface EnchantRanges {
  [ItemRarity.Ordinary]: EnchantRangeBoundary;
  [ItemRarity.Enchanted]: EnchantRangeBoundary;
  [ItemRarity.Rare]: EnchantRangeBoundary;
  [ItemRarity.Unique]: EnchantRangeBoundary;
  [ItemRarity.Legendary]: EnchantRangeBoundary;
  [ItemRarity.TrueLegendary]: EnchantRangeBoundary;
  [ItemRarity.Mythical]: EnchantRangeBoundary;
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
  Legendary = 'Legendary',
  Gem = 'Gem',
}

export enum EnchantCategory {
  Power = 'Power',
  Enchant = 'Enchant',
  Gem = 'Gem',
  Rune = 'Rune',
}

export interface SimpleEnchant {
  uuid: number;
  name: string;
  description: string;
  min: number;
  max: number;
  skills?: Record<number, string>;
}

export interface ItemEnchantSlot {
  count: number;
  types: EnchantType[]; // If multiple element it's an OR
  categoriesRestriction?: ItemCategory[];
}

export interface ItemEnchantSlots {
  baseEnchants: SimpleEnchant[];
  fixedEnchants: SimpleEnchant[];
  enchantSlots?: ItemEnchantSlot[];
}

export type CraftableEnchantTypes =
  | EnchantType.Epic
  | EnchantType.Major
  | EnchantType.Minor;
export type EnchantPoolType = Record<CraftableEnchantTypes, number[]>;
export type EnchantsPool = Record<ItemType, EnchantPoolType>;
