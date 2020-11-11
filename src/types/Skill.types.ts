import { CharacterClass } from './Character.types';

export interface Skill {
  uuid: number;
  name: string;
  tree: SkillTree;
  type?:  SkillType;
  family?: SkillFamily;
  class: CharacterClass;
  minLevel: number;
  maxRank: number;
  cooldown?: number;
  skillRequirement: number[];
  effect: string[];
  duration: number[];
  x: number;
  y: number;
  damage: string[];
  range: number[];
  range2: number[];
  element: DamageElement;
  value: number[];
  proc: number[];
  description: string;
  description_next?: string;
  cost?: number;
  cost100?: number;
}

export enum DamageElement {
  Ethereal = 'Ethereal',
  Fire = 'Fire',
  Frost = 'Frost',
  Holy = 'Holy',
  Lightning = 'Lightning',
  Physical = 'Physical',
  Poison = 'Poison',
  Shadow = 'Shadow',
}

export enum SkillFamily {
  Archery = 'Archery',
  Bane = 'Bane',
  Brawl = 'Brawl',
  Curse = 'Curse',
  Dragon = 'Dragon',
  Magic = 'Magic',
  Nature = 'Nature',
  Shield = 'Shield',
  Shout = 'Shout',
  Sorcery = 'Sorcery',
  Storm = 'Storm',
  Sword = 'Sword',
  Utility = 'Utility'
  // None = 'None',
}

export enum SkillType {
  Active = 'Active Skill',
  Passive = 'Passive Skill',
  Aura = 'Aura Skill',
  Companion = 'Companion Skill',
  Heritage = 'Heritage Skill',
  Ritual = 'Ritual Skill',
  Ultimate = 'Ultimate Skill'
}

export enum SkillTree {
  Mastery = 'Mastery',
  Conviction = 'Conviction',
  Corruptor = 'Corruptor',
  Demonologist = 'Demonologist',
  Dragonkin = 'Dragonkin',
  Druid = 'Druid',
  Frostborn = 'Frostborn',
  Guardian = 'Guardian',
  Lich = 'Lich',
  Reaper = 'Reaper',
  Redemption = 'Redemption',
  SkyLord = 'Sky Lord',
  StormCaller = 'Storm Caller',
  Vengeance = 'Vengeance',
  WindRanger = 'Wind Ranger',
  WinterHerald = 'Winter Herald',
  Wrath = 'Wrath'
}
