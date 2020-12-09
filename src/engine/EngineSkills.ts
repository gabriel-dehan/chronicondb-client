import Minisearch from 'minisearch';

import { allEnumValues } from 'helpers/typeUtils';
import { CharacterClass } from 'types/Character.types';
import { SkillsFilters } from 'types/Filters.types';
import { Skill, SkillTree } from 'types/Skill.types';

import { SKILLTREES_BY_CLASSES } from './data/dataMappings';
import Engine, { DataInterface } from './Engine';

interface FindParams {
  class: CharacterClass;
}

export default class EngineEnchants {
  public readonly engine: Engine;
  private searchEngine: Minisearch;
  public classes: CharacterClass[];
  public trees: SkillTree[];
  public treesByClasses: Partial<Record<CharacterClass, SkillTree[]>>;

  constructor(engine: Engine) {
    this.engine = engine;
    this.classes = [CharacterClass.Templar, CharacterClass.Berserker, CharacterClass.Warden, CharacterClass.Warlock];
    this.trees = allEnumValues(SkillTree);
    this.treesByClasses = SKILLTREES_BY_CLASSES;
    this.searchEngine = new Minisearch({
      idField: 'uuid',
      fields: ['name', 'class', 'tree', 'type', 'element', 'family', 'description'],
      storeFields: ['uuid'],
    });
  }

  public onDataLoaded() {
    this.searchEngine.removeAll();
    this.searchEngine.addAll(this.data.skillsSearchIndex);
  }

  /* Methods */
  public all(filters: SkillsFilters): Skill[] {
    let skills = this.skills;

    skills = this.filterBySearch(skills, filters);
    skills = this.filterByClassAndTree(skills, filters);
    skills = this.filterByFamily(skills, filters);
    skills = this.filterByTypes(skills, filters);
    // skills = this.sortBy(skills, filters);

    return skills;
  }

  public find(uuid: number, params?: FindParams): Skill | null {
    if (params) {
      return this.skills.find(skill => skill.uuid === uuid && skill.class === params.class) || null;
    } else {
      return this.skills.find(skill => skill.uuid === uuid) || null;
    }
  }

  public findByName(name: string): Skill | null {
    return this.data.skills.find(skill => skill.name.toLowerCase() === name.toLowerCase()) || null;
  }

  public defaultTreeForClass(characterClass: CharacterClass): SkillTree {
    const classTrees = this.treesByClasses[characterClass];
    return classTrees ? classTrees[0] : SkillTree.Mastery;
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }

  public get defaultClass(): CharacterClass {
    return this.classes[0];
  }

  public get defaultTree(): SkillTree {
    return this.defaultTreeForClass(this.defaultClass);
  }

  /* Private */
  private get skills(): Skill[] {
    if (this.engine.loaded) {
      return this.data.skills;
    }

    return [];
  }

  private filterBySearch(skills: Skill[], filters: SkillsFilters) {
    if (filters.search) {
      const resultingUuids = this.searchEngine.search(filters.search, {
        prefix: true,
        fuzzy: 0.2,
      }).map(r => r.uuid);

      return skills.filter(skill => resultingUuids.includes(skill.uuid));
    }

    return skills;
  }

  private filterByClassAndTree(skills: Skill[], filters: SkillsFilters) {
    if (filters.characterClass === 'All' || filters.tree === 'Any') {
      return skills;
    } else {
      const characterClass = (filters.characterClass || this.defaultClass) as CharacterClass;
      const tree = (filters.tree || this.defaultTree) as SkillTree;

      return skills.filter(skill => skill.class === characterClass && skill.tree === tree);
    }
  }


  private filterByFamily(skills: Skill[], filters: SkillsFilters) {
    if (filters.family && filters.family !== 'All') {
      return skills.filter(skill => filters.family === skill.family);
    }

    return skills;
  }

  private filterByTypes(skills: Skill[], filters: SkillsFilters) {
    if (filters.types) {
      return skills.filter(skill => skill.type && filters.types?.includes(skill.type));
    }

    return skills;
  }
}
