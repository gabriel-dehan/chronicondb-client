import { Skill } from 'types/Skill.types';

import Engine, { DataInterface } from './Engine';


export default class EngineEnchants {
  public readonly engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public onDataLoaded() {
    //
  }

  getSkillById(uuid: number): Skill | null {
    return this.data.skills.find(skill => skill.uuid === uuid) || null;
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }
}
