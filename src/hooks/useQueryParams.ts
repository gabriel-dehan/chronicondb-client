/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { isEqual } from 'lodash';
import compactObject from 'omit-empty';
import qs from 'query-string';

import camelCaseFlatten from 'helpers/objectUtils';
import { DeepPartial } from 'helpers/typeUtils';
import { useStores } from 'hooks/useStores';
import { UIStore, Filters, QueryFiltersInterface } from 'stores/UIStore';
import { DataStore } from 'types/DataStore.types';

interface Stores {
  [DataStore.UI]: UIStore;
}

/* This shit is overly complex and should be simplified. The typing is a mess too.
 * It basicaly stores the query params in the UIStore.
 */

export default function useQueryparams<T extends DeepPartial<Filters>>(): [T, (params: T) => void] {
  const { uiStore } = useStores<Stores>(DataStore.UI);
  const history = useHistory();
  const location = useLocation();
  const parsedQuery = parseQuery(location.search);
  const [queryParams, setQueryParams] = useState<T>(parsedQuery);

  useEffect(() => {
    history.replace({
      search: qs.stringify(filtersToQuery(queryParams)),
    });
  }, [queryParams, history]);

  useEffect(() => {
    const parsedQuery = parseQuery(location.search);

    if (!isEqual(parsedQuery, queryParams)) {
      uiStore.setParams(parsedQuery);
      setQueryParams(parsedQuery);
    }

  }, [location.search]);

  return [queryParams, _setQueryParams];

  function _setQueryParams(params: Partial<T>) {
    const _params = { ...queryParams, ...params };
    setQueryParams(_params);
  }

  function parseQuery(search: string): T {
    // @ts-ignore
    return queryToFilters(qs.parse(search));
  }

  function filtersToQuery(filters: T): QueryFiltersInterface {
    return camelCaseFlatten(filters) as unknown as QueryFiltersInterface;
  }

  function queryToFilters(query: QueryFiltersInterface): DeepPartial<Filters> {
    return compactObject({
      patch: query.patch,
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
    });
  }
}