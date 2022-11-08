/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useHistory, useLocation, matchPath } from 'react-router-dom';

import { capitalize } from 'lodash';
import { autorun } from 'mobx';

import { allEnumValues } from 'helpers/typeUtils';
import { useStores } from 'hooks/useStores';
import { RoutePath } from 'routes';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';
import {
  GeneralFilters,
  ItemsFilters,
  EnchantsFilters,
  SkillsFilters,
  FiltersType, ArtifactsFilters,
} from 'types/Filters.types';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

type useFiltersInterface<T> = [T, (params: T) => void];

const AVAILABLE_FILTERS_FOR_ROUTES: Record<RoutePath, FiltersType[]> = {
  [RoutePath.Items]: [FiltersType.General, FiltersType.Items],
  [RoutePath.Item]: [],
  [RoutePath.Enchants]: [FiltersType.General, FiltersType.Enchants],
  [RoutePath.Skills]: [FiltersType.General, FiltersType.Skills],
  [RoutePath.Skill]: [],
  [RoutePath.Artifacts]: [FiltersType.General, FiltersType.Artifacts],
  [RoutePath.Developers]: [FiltersType.General],
};

export default function useFilters
  <T extends GeneralFilters | ItemsFilters | EnchantsFilters | SkillsFilters | ArtifactsFilters>(filtersType: FiltersType)
  : useFiltersInterface<T>  {
  const routes = allEnumValues(RoutePath);
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const history = useHistory();
  const location = useLocation();

  // When the change location change and on first render, observe the filters store
  useEffect(() => {
    const path = (
      routes.find(route => matchPath(location.pathname, { path: route }))
      || location.pathname
    ) as RoutePath;

    autorun(() => {
      const filtersForPath = AVAILABLE_FILTERS_FOR_ROUTES[path];

      if (filtersForPath?.length > 0) {
        history.replace({
          search: filtersStore.toQueryString(filtersForPath || []),
        });
      }
    });
  }, [location.pathname]);

  return [filtersStore.filters[filtersType] as T, setFilters];

  /* A bit too metaprogramming for typescript */
  function setFilters(filters: T) {
    // @ts-ignore
    filtersStore[`set${capitalize(filtersType)}Filters`](filters);
  }
}