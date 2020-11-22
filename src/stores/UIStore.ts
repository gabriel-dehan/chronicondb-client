import { merge } from 'lodash';
import { observable, action, computed } from 'mobx';
import qs from 'query-string';

import patches from 'engine/data/patchs.json';
import { DeepPartial } from 'helpers/typeUtils';

export type QueryFiltersInterface = {
  patch: string;
  itemsSearch?: string;
  itemsCategory?: string;
  itemsType?: string;
  itemsCharacterClass?: string;
  itemsRarities?: string[];
  enchantsSearch?: string;
  enchantsType?: string;
  skillsSearch?: string;
  skillsCharacterClass: string;
}

export interface Filters {
  patch: string;
  items?: {
    search?: string;
    category?: string;
    type?: string;
    characterClass?: string;
    rarities?: string[];
  };
  enchants?: {
    search?: string;
    type?: string;
  };
  skills?: {
    search?: string;
    characterClass?: string;
  };
}

// Has a dependency on query params, not very clean but it works. See `useQueryParams`
export class UIStore {
  @observable
  public params: Filters;

  constructor() {
    // A bit ugly but gets the job done
    const query = qs.parse(location.search) as unknown as QueryFiltersInterface;

    this.params = {
      patch: query.patch || patches[patches.length - 1],
      items: {
        search: query.itemsSearch,
        category: query.itemsCategory,
        type: query.itemsType,
        characterClass: query.itemsCharacterClass,
        rarities: query.itemsRarities,
      },
      enchants: {
        search: query.enchantsSearch,
        type: query.enchantsType,
      },
      skills: {
        search: query.skillsSearch,
        characterClass: query.skillsCharacterClass,
      },
    };
  }

  @action
  setParams(value: DeepPartial<Filters>) {
    this.params = merge(this.params, value);
  }

  @computed
  get currentPatch() {
    return this.params.patch;
  }

  @computed
  get itemCategory() {
    return this.params.items?.category;
  }

  @computed
  get itemType() {
    return this.params.items?.type;
  }

}