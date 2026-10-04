export enum SortOrder {
  NameAsc = 'nameAsc',
  NameDesc = 'nameDesc',
  LevelAsc = 'levelAsc',
  LevelDesc = 'levelDesc',
}

export interface GeneralFilters {
  patch: string;
}

export interface ItemsFilters {
  search?: string;
  category?: string;
  type?: string;
  characterClass?: string;
  rarities?: string[];
  onlySet?: boolean;
  orderBy?: SortOrder;
}

export interface EnchantsFilters {
  search?: string;
  type?: string;
  category?: string;
  // only used for runes
  slot?: string;
  characterClass?: string;
}

export interface ArtifactsFilters {
  search?: string;
  type?: string;
  category?: string;
}

export interface BlessingsFilters {
  search?: string;
  kind?: string;
  slot?: string;
  characterClass?: string;
}

export interface SkillsFilters {
  search?: string;
  characterClass?: string;
  tree?: string;
  types?: string[];
  family?: string;
}

export interface Filters {
  general: GeneralFilters;
  items: ItemsFilters;
  enchants: EnchantsFilters;
  skills: SkillsFilters;
  artifacts: ArtifactsFilters;
  blessings: BlessingsFilters;
}

/* Flattened filters */
export type QueryFiltersInterface = {
  patch: string;
  itemsSearch?: string;
  itemsCategory?: string;
  itemsType?: string;
  itemsCharacterClass?: string;
  itemsRarities?: string[];
  itemsOnlySet?: string;
  itemsOrderBy?: string;
  enchantsSearch?: string;
  enchantsType?: string;
  enchantsCategory?: string;
  enchantsSlot?: string;
  enchantsCharacterClass?: string;
  skillsSearch?: string;
  skillsCharacterClass: string;
  skillsTree: string;
  skillsTypes: string[];
  skillsFamily: string;
  artifactSearch: string;
  artifactType: string;
  blessingsSearch?: string;
  blessingsKind?: string;
  blessingsSlot?: string;
  blessingsCharacterClass?: string;
}

export enum FiltersType {
  General = 'general',
  Items = 'items',
  Enchants = 'enchants',
  Skills = 'skills',
  Artifacts = 'artifacts',
  Blessings = 'blessings',
}
