import { observable, action } from 'mobx';

export class UIStore {

  @observable
  public prop = true;

  @action
  setProp(value: boolean): void {
    this.prop = value;
  }
}
