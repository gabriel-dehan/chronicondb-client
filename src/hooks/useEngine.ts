import Engine from 'engine/Engine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

export default function useEngine() {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);

  return new Engine(filtersStore.currentPatch);
}