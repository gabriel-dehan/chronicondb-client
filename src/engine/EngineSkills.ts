import Minisearch from 'minisearch';

import { Skill } from 'types/Skill.types';

import Engine, { DataInterface } from './Engine';

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
  public find(uuid: number): Skill | null {
    return this.skills.find(skill => skill.uuid === uuid) || null;
  }

  getSkillById(uuid: number): Skill | null {
    return this.data.skills.find(skill => skill.uuid === uuid) || null;
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

}
