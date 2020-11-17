import patches from 'engine/data/patchs.json';
import { observable, action } from 'mobx';

export class UIStore {

  @observable
  public currentPatch: string = patches[patches.length - 1];

  @action
  setCurrentPatch(value: string): void {
    this.currentPatch = value;
  }
}
