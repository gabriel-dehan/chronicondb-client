import Minisearch from 'minisearch';

import { allEnumValues } from '../helpers/typeUtils';
import { Blessing, BlessingKind, BlessingSlot, Curse } from '../types/Blessing.types';
import { CharacterClass } from '../types/Character.types';
import { BlessingsFilters } from '../types/Filters.types';
import Engine, { DataInterface } from './Engine';

export default class EngineBlessings {
  public readonly engine: Engine;
  private blessingsSearchEngine: Minisearch;
  private cursesSearchEngine: Minisearch;
  public kinds: BlessingKind[];
  public slots: BlessingSlot[];

  constructor(engine: Engine) {
    this.engine = engine;
    this.kinds = allEnumValues(BlessingKind);
    this.slots = allEnumValues(BlessingSlot);
    this.blessingsSearchEngine = new Minisearch({
      idField: 'uuid',
      fields: ['name', 'slot', 'classes', 'description'],
      storeFields: ['uuid'],
    });
    this.cursesSearchEngine = new Minisearch({
      idField: 'uuid',
      fields: ['name', 'slots', 'purifyAction', 'description'],
      storeFields: ['uuid'],
    });
  }

  public onDataLoaded() {
    this.blessingsSearchEngine.removeAll();
    this.blessingsSearchEngine.addAll(this.data.blessingsSearchIndex ?? []);
    this.cursesSearchEngine.removeAll();
    this.cursesSearchEngine.addAll(this.data.cursesSearchIndex ?? []);
  }

  /* Methods */
  public blessings(filters: BlessingsFilters): Blessing[] {
    let blessings = this.allBlessings;

    blessings = this.filterBySearch(blessings, this.blessingsSearchEngine, filters);

    if (filters.slot && filters.slot !== 'All') {
      blessings = blessings.filter(({ slot }) => slot === filters.slot);
    }

    if (filters.characterClass && filters.characterClass !== CharacterClass.All) {
      blessings = blessings.filter(({ classes }) => classes.includes(filters.characterClass as CharacterClass));
    }

    return blessings;
  }

  public curses(filters: BlessingsFilters): Curse[] {
    let curses = this.allCurses;

    curses = this.filterBySearch(curses, this.cursesSearchEngine, filters);

    if (filters.slot && filters.slot !== 'All') {
      curses = curses.filter(({ slots }) => slots.includes(filters.slot as BlessingSlot));
    }

    return curses;
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }

  public get defaultKind(): BlessingKind {
    return BlessingKind.Blessings;
  }

  private get allBlessings(): Blessing[] {
    if (this.engine.loaded) {
      return this.data.blessings ?? [];
    }

    return [];
  }

  private get allCurses(): Curse[] {
    if (this.engine.loaded) {
      return this.data.curses ?? [];
    }

    return [];
  }

  /* Private */
  private filterBySearch<T extends Blessing | Curse>(entries: T[], searchEngine: Minisearch, filters: BlessingsFilters) {
    if (filters.search) {
      const resultingUuids = searchEngine.search(filters.search, {
        prefix: true,
        combineWith: 'AND',
      }).map(r => r.uuid);

      return entries.filter(entry => resultingUuids.includes(entry.uuid));
    }

    return entries;
  }
}
