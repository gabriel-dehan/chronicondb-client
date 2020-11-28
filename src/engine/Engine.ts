import { CharacterClass } from 'types/Character.types';
import { Enchant } from 'types/Enchant.types';
import { Item, ItemSet } from 'types/Item.types';
import { Skill, SkillTree } from 'types/Skill.types';

import EngineItems from './Items';

type Version = string;

export interface DataInterface {
  items: Item[];
  enchants: Enchant[];
  sets: ItemSet[];
  skills: Skill[];
  skillsByClass: Record<CharacterClass, Record<SkillTree, Skill[]>>;
}

/* Singleton */
export default class Engine {
  public version!: Version;
  public data?: DataInterface;

  public Items!: EngineItems;
  // public readonly Enchants!: EngineEnchants;
  // public readonly Skills!: EngineSkills;

  constructor(version: Version) {
    this.version = version;
    this.Items = new EngineItems(this);
  }

  public get loaded(): boolean {
    return !!this.data;
  }

  public async loadVersion(version: Version) {
    if (version !== this.version) {
      this.data = undefined;
      this.version = version;
      await this.loadData();
    }
  }

  public async loadData() {
    this.data = (await import(`./data/${this.version}/extracts`)).default;
  }
}