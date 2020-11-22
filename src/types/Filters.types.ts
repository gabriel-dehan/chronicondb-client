export interface GeneralFilters {
  patch: string;
}

export interface ItemsFilters {
  search?: string;
  category?: string;
  type?: string;
  characterClass?: string;
  rarities?: string[];
}

export interface EnchantsFilters {
  search?: string;
  type?: string;
}

export interface SkillsFilters {
  search?: string;
  characterClass?: string;
}

export interface Filters {
  general: GeneralFilters;
  items: ItemsFilters;
  enchants: EnchantsFilters;
  skills: SkillsFilters;
}

/* Flattened filters */
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

export enum FiltersType {
  General = 'general',
  Items = 'items',
  Enchants = 'enchants',
  Skills = 'skills'
}
