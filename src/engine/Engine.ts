import { compare } from 'compare-versions';

import { CharacterClass } from 'types/Character.types';
import { Enchant, EnchantsPool } from 'types/Enchant.types';
import { Item, ItemSet } from 'types/Item.types';
import { Skill, SkillTree } from 'types/Skill.types';

import { ArtifactInterface } from '../types/Artifact.types';
import EngineArtifacts from './EngineArtifacts';
import EngineEnchants from './EngineEnchants';
import EngineItems from './EngineItems';
import EngineSkills from './EngineSkills';

type Version = string;

export interface DataInterface {
  artifacts: ArtifactInterface[];
  artifactsSearchIndex: Record<string, string | number>[];
  items: Item[];
  enchants: Enchant[];
  enchantsPool: EnchantsPool;
  sets: ItemSet[];
  skills: Skill[];
  skillsByClass: Record<CharacterClass, Record<SkillTree, Skill[]>>;
  itemsSearchIndex: Record<string, string | number>[];
  enchantsSearchIndex: Record<string, string | number>[];
  skillsSearchIndex: Record<string, string | number>[];
}

/* Singleton */
export default class Engine {
  public version!: Version;
  public data?: DataInterface;

  public readonly Items!: EngineItems;
  public readonly Enchants!: EngineEnchants;
  public readonly Skills!: EngineSkills;
  public readonly Artifacts!: EngineArtifacts;

  constructor(version: Version) {
    this.version = version;
    this.Items = new EngineItems(this);
    this.Enchants = new EngineEnchants(this);
    this.Skills = new EngineSkills(this);
    this.Artifacts = new EngineArtifacts(this);
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
    this.Items.onDataLoaded();
    this.Enchants.onDataLoaded();
    this.Skills.onDataLoaded();
    if (compare(this.version, '1.40.1', '>=')) {
      this.Artifacts.onDataLoaded();
    }

    // console.log('Enchants', this.data?.enchants.length);
    // console.log('Skills', this.data?.skills.length);
    // console.log('Items', this.data?.items.length);
  }
}