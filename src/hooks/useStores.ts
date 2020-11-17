import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import { Stores } from 'types/DataStore.types';

/**
 * Use MobX stores provided by the MobX context
 *
 * @param {DataStore} [storeNames] list of DataStores to be returned. Values can be taken from the `DataStore` enum. If left empty all available stores are returned
 */
export function useStores<StoresData extends Partial<Stores>>(...storeNames: (keyof StoresData)[]): StoresData {
  const allStores: StoresData = useContext(MobXProviderContext) as StoresData;
  let stores: StoresData;

  if (storeNames && storeNames.length) {
    stores = {} as StoresData;
    storeNames.forEach((storeName) => {
      const store = allStores[storeName];
      if (!store) {
        throw new Error(`Attempting to get an in-existant MobX store: ${storeName}`);
      }

      stores[storeName] = store;
    });
  } else {
    stores = allStores;
  }

  return stores;
}
