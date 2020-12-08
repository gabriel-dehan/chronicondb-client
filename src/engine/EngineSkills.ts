import Minisearch from 'minisearch';

import { CharacterClass } from 'types/Character.types';
import { SkillsFilters } from 'types/Filters.types';
import { Skill } from 'types/Skill.types';

import Engine, { DataInterface } from './Engine';

interface FindParams {
  class: CharacterClass;
}

export default class EngineEnchants {
  public readonly engine: Engine;
  private searchEngine: Minisearch;

  constructor(engine: Engine) {
    this.engine = engine;
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
    // skills = this.filterByClassAndTree(skills, filters);
    // skills = this.filterByTypes(skills, filters);
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

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
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

}
