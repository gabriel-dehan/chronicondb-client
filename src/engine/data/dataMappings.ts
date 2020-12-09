import { CharacterClass } from '../../types/Character.types';
import { EnchantType, ItemEnchantSlot } from '../../types/Enchant.types';
import { ItemCategory, SetUuid, ItemType, ItemRarity } from '../../types/Item.types';
import { SkillTree } from '../../types/Skill.types';

export const EpicEnchantableCategories: ItemCategory[] = [ItemCategory.Ring, ItemCategory.Amulet];
export const EnchantableCategories: ItemCategory[] = [
  ItemCategory.Ring,
  ItemCategory.Amulet,
  ItemCategory.Accessory,
  ItemCategory.Armor,
  ItemCategory.Boots,
  ItemCategory.Helmet,
  ItemCategory.Offhand,
  ItemCategory.Weapon,
];

export const ENCHANT_SLOTS_BY_RARITY: Record<ItemRarity, ItemEnchantSlot[]> = {
  [ItemRarity.Ordinary]: [],
  [ItemRarity.Enchanted]: [
    {
      count: 1,
      types: [EnchantType.Minor, EnchantType.Major],
      categoriesRestriction: EnchantableCategories,
    },
  ],
  [ItemRarity.Rare]: [
    {
      count: 1,
      types: [EnchantType.Minor],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 1,
      types: [EnchantType.Major],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 1,
      types: [EnchantType.Epic],
      categoriesRestriction: EpicEnchantableCategories,
    },
  ],
  [ItemRarity.Unique]: [
    {
      count: 1,
      types: [EnchantType.Minor],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 2,
      types: [EnchantType.Major],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 1,
      types: [EnchantType.Epic],
      categoriesRestriction: EpicEnchantableCategories,
    },
  ],
  [ItemRarity.Legendary]: [
    {
      count: 2,
      types: [EnchantType.Minor],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 2,
      types: [EnchantType.Major],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 1,
      types: [EnchantType.Epic],
      categoriesRestriction: EpicEnchantableCategories,
    },
  ],
  [ItemRarity.TrueLegendary]: [
    {
      count: 2,
      types: [EnchantType.Minor],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 2,
      types: [EnchantType.Major],
      categoriesRestriction: EnchantableCategories,
    },
    {
      count: 1,
      types: [EnchantType.Epic],
      categoriesRestriction: EpicEnchantableCategories,
    },
  ],
  [ItemRarity.Mythical]: [],
};

export const ITEM_TYPES_BY_CATEGORIES: Record<ItemCategory, ItemType[]> = {
  [ItemCategory.Helmet]: [ItemType.Helm],
  [ItemCategory.Armor]: [ItemType.Armor],
  [ItemCategory.Boots]: [ItemType.Boots],
  [ItemCategory.Weapon]: [
    ItemType.Bow,
    ItemType.Sword,
    ItemType.Staff,
    ItemType.Fists,
  ],
  [ItemCategory.Offhand]: [
    ItemType.Spellbook,
    ItemType.Shield,
    ItemType.Tome,
    ItemType.Claw,
    ItemType.Arrow,
  ],
  [ItemCategory.Ring]: [ItemType.Ring],
  [ItemCategory.Amulet]: [ItemType.Amulet],
  [ItemCategory.Accessory]: [ItemType.Accessory],
  [ItemCategory.Gem]: [
    ItemType.CubeGem,
    ItemType.StarGem,
    ItemType.SphereGem,
  ],
  [ItemCategory.Consumables]: [
    ItemType.Elixir,
    ItemType.Potion,
    ItemType.Scroll,
    ItemType.Relic,
  ],
  [ItemCategory.Misc]: [
    ItemType.Key,
    ItemType.QuestItem,
    ItemType.SpecialItem,
    ItemType.Container,
    ItemType.UnknownItem,
    ItemType.Bag,
  ],
  [ItemCategory.Craft]: [
    ItemType.CraftingMaterial,
    ItemType.Rune,
  ],
};

export const SETS_BY_CLASS: Record<CharacterClass, SetUuid[]> = {
  [CharacterClass.All]: [
    SetUuid.Scout,
    SetUuid.WrathfulRevenge,
    SetUuid.Seeker,
    SetUuid.Challenger,
    SetUuid.Thief,
    SetUuid.Bond,
    SetUuid.Harverst,
    SetUuid.Summoner,
    SetUuid.SunAndMoon,
    SetUuid.FuriousRetaliation,
    SetUuid.AllForOne,
    SetUuid.OneForAll,
  ],
  [CharacterClass.Templar]: [
    SetUuid.Reckoning,
    SetUuid.Valkyrie,
    SetUuid.ThunderCharged,
    SetUuid.ThunderingArmy,
    SetUuid.Caines,
    SetUuid.Wargod,
    SetUuid.Ayeela,
    SetUuid.Soulpurger,
  ],
  [CharacterClass.Berserker]: [
    SetUuid.Bloodsoak,
    SetUuid.Cataclysm,
    SetUuid.SpiritualGarb,
    SetUuid.Skysoul,
    SetUuid.Dragonfire,
    SetUuid.Volcanic,
    SetUuid.NothernRage,
    SetUuid.FrostWyrm,
  ],
  [CharacterClass.Warden]: [
    SetUuid.HighRanger,
    SetUuid.Windcaller,
    SetUuid.Everspring,
    SetUuid.ShroomTender,
    SetUuid.Stormcaller,
    SetUuid.WispMother,
    SetUuid.Torrential,
    SetUuid.Snowstorm,
  ],
  [CharacterClass.Warlock]: [
    SetUuid.BloodBinder,
    SetUuid.PlagueMage,
    SetUuid.Coldhearted,
    SetUuid.Deathbringer,
    SetUuid.DemonLord,
    SetUuid.BurningHells,
    SetUuid.Desecrator,
    SetUuid.Masochist,
  ],
};

export const ITEM_ID_BY_SETS: Record<SetUuid, number[]> = {
  [SetUuid.SunAndMoon]: [504, 505],
  [SetUuid.Seeker]: [331, 332, 333],
  [SetUuid.Bond]: [496, 497],
  [SetUuid.AllForOne]: [502, 503],
  [SetUuid.OneForAll]: [500, 501],
  [SetUuid.Scout]:  [151, 327, 328],
  [SetUuid.Summoner]: [510, 511, 512, 513],
  [SetUuid.Thief]: [494, 495],
  [SetUuid.Harverst]:  [498, 499],
  [SetUuid.WrathfulRevenge]: [329, 330, 149],
  [SetUuid.FuriousRetaliation]: [506, 507, 508, 509],
  [SetUuid.Challenger]: [334, 335, 336],
  [SetUuid.Valkyrie]: [547, 548, 549, 550],
  [SetUuid.Reckoning]: [376, 377, 378, 379],
  [SetUuid.ThunderingArmy]: [539, 540, 541, 542],
  [SetUuid.ThunderCharged]: [123, 134, 318, 326],
  [SetUuid.Caines]: [372, 373, 374, 375],
  [SetUuid.Wargod]: [543, 544, 545, 546],
  [SetUuid.Soulpurger]: [535, 536, 537, 538],
  [SetUuid.Ayeela]: [124, 323, 324, 325],
  [SetUuid.Bloodsoak]: [91, 100, 337, 556],
  [SetUuid.Cataclysm]: [552, 553, 554, 555],
  [SetUuid.Skysoul]: [557, 558, 559, 560],
  [SetUuid.SpiritualGarb]: [380, 381, 382, 383],
  [SetUuid.Volcanic]: [562, 563, 564, 565],
  [SetUuid.Dragonfire]: [102, 339, 340, 561],
  [SetUuid.NothernRage]: [384, 385, 386, 566],
  [SetUuid.FrostWyrm]: [567, 568, 569, 570],
  [SetUuid.BloodBinder]: [368, 369, 370, 594],
  [SetUuid.PlagueMage]: [598, 599, 600, 601],
  [SetUuid.Coldhearted]: [113, 321, 322, 596],
  [SetUuid.Deathbringer]: [606, 607, 608, 609],
  [SetUuid.DemonLord]: [112, 118, 319, 595],
  [SetUuid.BurningHells]: [602, 603, 604, 605],
  [SetUuid.Desecrator]: [364, 365, 366, 597],
  [SetUuid.Masochist]: [610, 611, 612, 613],
  [SetUuid.HighRanger]: [142, 341, 342, 343],
  [SetUuid.Windcaller]: [576, 577, 578, 579],
  [SetUuid.ShroomTender]: [585, 586, 587, 588],
  [SetUuid.Everspring]: [388, 389, 390, 391],
  [SetUuid.Stormcaller]: [74, 139, 140, 580],
  [SetUuid.WispMother]: [581, 582, 583, 584],
  [SetUuid.Torrential]: [590, 591, 592, 593],
  [SetUuid.Snowstorm]: [392, 393, 394, 589],
  [SetUuid.Christmas]: [716, 717, 718, 719, 720],
  [SetUuid.Master]: [776, 616],
};

export const SKILLTREES_BY_CLASSES: Partial<Record<CharacterClass, SkillTree[]>> = {
  [CharacterClass.Templar]: [
    SkillTree.Vengeance,
    SkillTree.Wrath,
    SkillTree.Conviction,
    SkillTree.Redemption,
    SkillTree.Mastery,
  ],
  [CharacterClass.Berserker]: [
    SkillTree.Guardian,
    SkillTree.SkyLord,
    SkillTree.Dragonkin,
    SkillTree.Frostborn,
    SkillTree.Mastery,
  ],
  [CharacterClass.Warden]: [
    SkillTree.WindRanger,
    SkillTree.Druid,
    SkillTree.StormCaller,
    SkillTree.WinterHerald,
    SkillTree.Mastery,
  ],
  [CharacterClass.Warlock]: [
    SkillTree.Corruptor,
    SkillTree.Lich,
    SkillTree.Demonologist,
    SkillTree.Reaper,
    SkillTree.Mastery,
  ],
};
