import React, { FunctionComponent, useState } from 'react';
import { useAsync } from 'react-async-hook';

import { Provider } from 'mobx-react';

import Loader from 'components/atoms/Loader/Loader';
import EngineContext from 'engine/context';
import Engine from 'engine/Engine';
import Main from 'pages/Main';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore, Stores } from 'types/DataStore.types';

const App: FunctionComponent = () => {
  const [stores, setAllStores] = useState<Stores | null>(null);
  const [engine, setEngine] = useState<Engine | null>(null);

  useAsync(() => loadStoresAndData(), []);

  if (!stores || !engine) {
    return <Loader width={100} height={100} color="white" />;
  }

  return (
    <Provider {...stores}>
      <EngineContext.Provider value={engine}>
        <Main />
      </EngineContext.Provider>
    </Provider>
  );

  // return (
  //   <I18nextProvider i18n={i18n}>
  //           <Provider {...stores}>
  //             <Main history={history} />
  //           </Provider>
  //   </I18nextProvider>
  // );

  async function loadStoresAndData() {
    const loadedStores = await loadStores();
    setAllStores(loadedStores);
    setEngine(new Engine(loadedStores[DataStore.Filters].currentPatch));
  }

};

async function loadStores(): Promise<Stores> {
  // Init rest of stores, (MobX requires all stores are instantiated immediately)
  return {
    [DataStore.Filters]: new FiltersStore(),
  };
}


export default App;