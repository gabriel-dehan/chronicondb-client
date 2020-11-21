import EngineItems from './Items';

export default class Engine {
  private version: string;
  public readonly items: EngineItems;

  constructor(patch: string) {
    this.version = patch;
    this.items = new EngineItems(this);
  }

  // public Items() {

  // }

  // public Enchants() {

  // }

  // public Skills() {

  // }
}