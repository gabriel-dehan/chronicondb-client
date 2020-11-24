import { CharacterClass } from 'types/Character.types';
import { Enchant } from 'types/Enchant.types';
import { Item, ItemSet } from 'types/Item.types';
import { Skill, SkillTree } from 'types/Skill.types';

import Data from './data';
import EngineItems from './Items';

type Version = string;

interface DataInterface {
  items: Item[];
  enchants: Enchant[];
  sets: ItemSet[];
  skills: Skill[];
  skillsByClass: Record<CharacterClass, Record<SkillTree, Skill[]>>;
}

/* Singleton */
export default class Engine {
  private static instance: Engine;
  private version!: Version;
  private data!: DataInterface;

  public Items!: EngineItems;
  // public readonly Enchants!: EngineEnchants;
  // public readonly Skills!: EngineSkills;

  constructor(version: Version) {
    if (Engine.instance) {
      /* If version has changed reload data */
      if (Engine.instance.version !== version) {
        Engine.instance.version = version;
        Engine.instance.loadData();
      }
      return Engine.instance;
    }

    this.version = version;
    this.loadData();
    this.Items = new EngineItems(this);
    Engine.instance = this;
  }

  private loadData() {
    // @ts-ignore
    this.data = Data[this.version];
  }
}