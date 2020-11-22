/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import camelCaseKeys from 'camelcase-keys';
import { flatten } from 'flatten-anything';
import { isEqual, merge, cloneDeep } from 'lodash';
import compactObject from 'omit-empty';
import qs from 'query-string';

import { DeepPartial } from 'helpers/typeUtils';
import { useStores } from 'hooks/useStores';
import { UIStore, Filters, QueryFiltersInterface } from 'stores/UIStore';
import { DataStore } from 'types/DataStore.types';

interface Stores {
  [DataStore.UI]: UIStore;
}

/* This shit is overly complex and should be simplified. The typing is a mess too.
 * It basicaly stores the query params in the UIStore and return the UIStore params.
 */

export default function useFilters<T extends DeepPartial<Filters>>(): [Filters, (params: T) => void] {
  const { uiStore } = useStores<Stores>(DataStore.UI);
  const history = useHistory();
  const location = useLocation();
  const parsedQuery = parseQuery(location.search);
  const [queryParams, setQueryParams] = useState<T>(parsedQuery);

  // After query params changed, update query string
  useEffect(() => {
    history.replace({
      search: qs.stringify(filtersToQuery(queryParams)),
    });
  }, [queryParams, history]);

  // After query string change, update uistore
  useEffect(() => {
    const parsedQuery = parseQuery(location.search);
    if (!isEqual(parsedQuery, queryParams)) {
      console.log(parsedQuery, queryParams);
      uiStore.setParams(parsedQuery);
      // setQueryParams(parsedQuery);
    }

  }, [location.search]);

  return [uiStore.params, _setQueryParams];

  function _setQueryParams(params: Partial<T>) {
    //@ts-ignore
    setQueryParams(withUIStore(params));
  }

  function withUIStore(params: Partial<T>) {
    const currentParams = cloneDeep(uiStore.params);
    return merge(currentParams, params);
  }

  function parseQuery(search: string): T {
    // @ts-ignore
    return queryToFilters(qs.parse(search));
  }

  function filtersToQuery(filters: T): QueryFiltersInterface {
    return camelCaseKeys(flatten(filters, 1)) as unknown as QueryFiltersInterface;
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