import { CharacterClass } from 'types/Character.types';

export interface Item {
  uuid: number,
  name: string,
  icon: string | null,
  flavor?: string,
  description?: string,
  category: ItemCategory,
  type: ItemType,
  rarity: ItemRarity,
  classRestriction: CharacterClass | null;
  minLevel: number;
  set: SetId | null;
  baseEnchants: number[];
  fixedEnchants: number[];
}

export interface ItemSet {
  id: SetId;
  name: string;
  items: number[];
  bonuses: Record<number, string>;
}

export enum ItemRarity {
  Ordinary = 'Ordinary',
  Enchanted = 'Enchanted',
  Rare = 'Rare',
  Unique = 'Unique',
  Legendary = 'Legendary',
  TrueLegendary = 'True Legendary',
  Set = 'Set',
  Mythical = 'Mythical'
}

export enum ItemCategory {
  Helmet = 'Helmet',
  Armor = 'Armor',
  Boots = 'Boots',
  Weapon = 'Weapon',
  Offhand = 'Offhand',
  Ring = 'Ring',
  Amulet = 'Amulet',
  Accessory = 'Accessory',
  Consumables = 'Consumables',
  Gem = 'Gem',
  Misc = 'Misc',
  Craft = 'Craft'
}

export enum ItemType {
  Helm = 'Helm',
  Armor = 'Armor',
  Bow = 'Bow',
  Sword = 'Sword',
  Staff = 'Staff',
  Fists = 'Fists',
  Boots = 'Boots',
  Accessory = 'Accessory',
  Ring = 'Ring',
  Amulet = 'Amulet',
  Claw = 'Claw',
  Arrow = 'Arrow',
  Spellbook = 'Spellbook',
  Shield = 'Shield',
  Key = 'Key',
  Tome = 'Tome',
  Elixir = 'Elixir',
  QuestItem = 'Quest Item',
  SpecialItem = 'Special Item',
  Scroll = 'Scroll',
  Potion = 'Potion',
  Container = 'Container',
  CraftingMaterial = 'Crafting Material',
  UnknownItem = 'Unknown Item',
  Bag = 'Bag',
  CubeGem = 'Cube Gem',
  SphereGem = 'Sphere Gem',
  StarGem = 'Star Gem',
  Relic = 'Relic',
  Rune = 'Item'
}

export enum SetId {
  SunAndMoon = 'sunandmoon',
  Seeker = 'seeker',
  Bond = 'bond',
  AllForOne = 'element1',
  OneForAll = 'element2',
  Scout = 'scout',
  Summoner = 'summoner',
  Thief = 'thiefs',
  Harverst = 'harvest',
  WrathfulRevenge = 'thorns',
  FuriousRetaliation = 'thorns2',
  Challenger = 'challenger',
  Valkyrie = 'valkyrie',
  Reckoning = 'reckoning',
  ThunderingArmy = 'thunderingarmy',
  ThunderCharged = 'thundercharge',
  Caines = 'caines',
  Wargod = 'wargod',
  Soulpurger = 'soulpurger',
  Ayeela = 'ayeela',
  Bloodsoak = 'bloodsoak',
  Cataclysm = 'cataclysm',
  Skysoul = 'soulsky',
  SpiritualGarb = 'spiritgarb',
  Volcanic = 'volcano',
  Dragonfire = 'dragonfire',
  NothernRage = 'northernrage',
  FrostWyrm = 'frostwyrm',
  BloodBinder = 'bloodbinder',
  PlagueMage = 'plaguemage',
  Coldhearted = 'coldhearted',
  Deathbringer = 'deathbringers',
  DemonLord = 'demonlord',
  BurningHells = 'burninghell',
  Desecrator = 'desecrators',
  Masochist = 'masochists',
  HighRanger = 'highranger',
  Windcaller = 'windcaller',
  ShroomTender = 'shroomtender',
  Everspring = 'everspring',
  Stormcaller = 'stormcaller',
  WispMother = 'wispmother',
  Torrential = 'torrent',
  Snowstorm = 'snowstorm',
  Christmas = 'xmas',
  Master = 'masters',
}
