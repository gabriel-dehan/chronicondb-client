import camelCaseKeys from 'camelcase-keys';
import { flatten } from 'flatten-anything';
import { isEmpty, merge, pick, has } from 'lodash';
import { observable, action, computed } from 'mobx';
import qs from 'query-string';

import patches from 'engine/data/patches.json';
import * as FiltersTypes from 'types/Filters.types';

// Has a dependency on query params, not very clean but it works. See `useFilters`
export class FiltersStore {
  @observable
  public general: FiltersTypes.GeneralFilters;

  @observable
  public items: FiltersTypes.ItemsFilters;

  @observable
  public enchants: FiltersTypes.EnchantsFilters;

  @observable
  public skills: FiltersTypes.SkillsFilters;

  @observable
  public artifacts: FiltersTypes.ArtifactsFilters;

  // A bit ugly but gets the job done
  constructor() {
    const query = qs.parse(location.search) as unknown as FiltersTypes.QueryFiltersInterface;

    const latestPatch = patches[patches.length - 1];
    /* Make sure the patch in the query string exists,
     * And, yes, I DARED nest that, sue me! :smirk:
     */
    const defaultPatch = query.patch
      ? patches.includes(query.patch)
        ? query.patch
        : latestPatch
      : latestPatch;

    this.general = {
      patch: defaultPatch,
    };

    this.items = {
      search: query.itemsSearch,
      category: query.itemsCategory,
      type: query.itemsType,
      characterClass: query.itemsCharacterClass,
      rarities: query.itemsRarities,
      orderBy: query.itemsOrderBy as FiltersTypes.SortOrder,
      onlySet: query.itemsOnlySet ? query.itemsOnlySet === 'true' : undefined, // typecast
    };

    this.enchants = {
      search: query.enchantsSearch,
      type: query.enchantsType,
      category: query.enchantsCategory,
    };

    this.skills = {
      search: query.skillsSearch,
      characterClass: query.skillsCharacterClass,
      tree: query.skillsTree,
      types: query.skillsTypes,
      family: query.skillsFamily,
    };

    this.artifacts = {
      search: query.artifactSearch,
      type: query.artifactType,
    };
  }

  @action
  public setGeneralFilters(filters: Partial<FiltersTypes.GeneralFilters>) {
    this.general = merge(this.general, filters);
  }

  @action
  public setItemsFilters(filters: Partial<FiltersTypes.ItemsFilters>) {
    this.items = merge(this.items, filters);

    // Override rarities instead of merge as it is an array of unique toggleable values
    if (filters.rarities) {
      this.items.rarities = filters.rarities;
    }

    // Allow undefined value for search
    if (has(filters, 'search') && isEmpty(filters.search)) {
      this.items.search = undefined;
    }
  }

  @action
  public setEnchantsFilters(filters: Partial<FiltersTypes.EnchantsFilters>) {
    this.enchants = merge(this.enchants, filters);

    // Allow undefined value for search
    if (has(filters, 'search') && isEmpty(filters.search)) {
      this.enchants.search = undefined;
    }
  }

  @action
  public setSkillsFilters(filters: Partial<FiltersTypes.SkillsFilters>) {
    this.skills = merge(this.skills, filters);

    // Allow undefined value for search
    if (has(filters, 'search') && isEmpty(filters.search)) {
      this.skills.search = undefined;
    }
  }

  @action
  public setArtifactsFilters(filters: Partial<FiltersTypes.ArtifactsFilters>) {
    this.artifacts = merge(this.artifacts, filters);

    // Allow undefined value for search
    if (has(filters, 'search') && isEmpty(filters.search)) {
      this.artifacts.search = undefined;
    }
  }

  @computed
  get filters(): FiltersTypes.Filters {
    return {
      general: this.general,
      items: this.items,
      enchants: this.enchants,
      skills: this.skills,
      artifacts: this.artifacts,
    };
  }

  @computed
  get currentPatch() {
    return this.general.patch;
  }

  public toQueryString(filtersTypes: FiltersTypes.FiltersType[]): string {
    const query = camelCaseKeys(
      flatten(pick(this.filters, filtersTypes), 1)
    ) as Record<string, string>;

    // Rename patch key so it is less intrusive
    if (filtersTypes.includes(FiltersTypes.FiltersType.General)) {
      query.patch = query.generalPatch;
      delete query.generalPatch;
    }

    return qs.stringify(query as unknown as FiltersTypes.QueryFiltersInterface);
  }
}