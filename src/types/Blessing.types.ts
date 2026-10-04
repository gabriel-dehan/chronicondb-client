import { CharacterClass } from './Character.types';

export enum BlessingSlot {
  Helm = 'Helm',
  Armor = 'Armor',
  Weapon = 'Weapon',
  Accessory = 'Accessory',
  Amulet = 'Amulet',
  Ring = 'Ring',
  Boots = 'Boots',
  Offhand = 'Offhand',
}

export enum BlessingKind {
  Blessings = 'Blessings',
  Curses = 'Curses',
}

export interface Blessing {
  uuid: number;
  name: string;
  // Contains an AMOUNT placeholder, replaced by `value` when displayed
  description: string;
  value: number;
  slot?: BlessingSlot;
  classes: CharacterClass[];
}

export interface Curse {
  uuid: number;
  name: string;
  // May contain a NUM placeholder, replaced by `value` when displayed
  description: string;
  value?: number;
  slots: BlessingSlot[];
  shieldOnly: boolean;
  // Contains a MAX placeholder, replaced by `purifyRequired` when displayed
  purifyAction: string;
  purifyRequired: number;
}
