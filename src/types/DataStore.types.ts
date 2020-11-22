import { FiltersStore } from 'stores/FiltersStore';

export enum DataStore {
  Filters = 'filtersStore'
}

export interface Stores {
  [DataStore.Filters]: FiltersStore;
}
