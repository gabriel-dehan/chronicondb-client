import { reduce, isEmpty, map, pickBy } from 'lodash';

import { ItemSet, SetUuid } from '../../types/Item.types';
import { ITEM_ID_BY_SETS } from '../data/dataMappings';
import { writeFile } from '../utils/fileUtils';
import { getLocaleSection } from './parseLocale';

export interface SetLocaleData {
  [key: string]: Record<string, string>;
}
export function parseSets(version: string, verbose = false): ItemSet[] {
  const setLocales = parseLocale(version);

  const sets: ItemSet[] = map(setLocales, (setData, setId) => {
    const { name } = setData;
    const uuid = setId as SetUuid;
    const piecesBonus = pickBy(setData, (_, key) => key.match(/\dpbonus/));
    const bonuses = reduce(piecesBonus, (setBonuses: Record<number, string>, bonus, key) => {
      const matches = key.match(/(\d)pbonus/);

      if (matches) {
        setBonuses[parseInt(matches[1])] = bonus;
      }

      return setBonuses;
    }, {});

    const set = {
      uuid,
      name,
      bonuses,
      itemIds: ITEM_ID_BY_SETS[uuid],
    };

    if (verbose) {
      console.log(set);
    }

    return set;
  });

  writeFile(sets, version, 'sets');

  return sets;
}

function parseLocale(version: string): SetLocaleData {
  const localeData = getLocaleSection(version, 'locale/EN/items', 'sets');

  return reduce(localeData, (setData: SetLocaleData, value, key) => {
    const matches = key.match(/^(\w+)_(\w+)$/);

    if (matches) {
      const itemId = matches[1];
      const keyName = matches[2];

      if (!setData[itemId]) {
        setData[itemId] = {};
      }

      if (!isEmpty(value)) {
        setData[itemId][keyName] = value;
      }
    }

    return setData;
  }, {});
}
