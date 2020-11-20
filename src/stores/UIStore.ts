import { observable, action } from 'mobx';

import patches from 'engine/data/patchs.json';

export class UIStore {

  @observable
  public currentPatch: string = patches[patches.length - 1];

  @action
  setCurrentPatch(value: string): void {
    this.currentPatch = value;
  }
}
