import { UIStore } from 'stores/UIStore';

export enum DataStore {
  UI = 'uiStore'
}

export interface Stores {
  [DataStore.UI]: UIStore;
}
