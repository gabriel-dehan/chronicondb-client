import Engine from 'engine/Engine';

import { useStores } from 'hooks/useStores';
import { UIStore } from 'stores/UIStore';
import { DataStore } from 'types/DataStore.types';

interface Stores {
  [DataStore.UI]: UIStore;
}
export default function useEngine() {
  const { uiStore } = useStores<Stores>(DataStore.UI);

  return new Engine(uiStore.currentPatch);
}