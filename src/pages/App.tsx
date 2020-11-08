import { Provider } from 'mobx-react';
import Main from 'pages/Main';
import React, { FunctionComponent, useState } from 'react';
import { useAsync } from 'react-async-hook';
import { UIStore } from 'stores/UIStore';
import { DataStore, Stores } from 'types/DataStore.types';

export const App: FunctionComponent =  () => {
  // const { t } = useTranslation();
  const [stores, setAllStores] = useState<Stores | null>(null);

  useAsync(() => loadStoresAndLocales(), []);

  if (!stores) {
    return <div>Loading</div>;
  }

  return (
    <Provider {...stores}>
      <Main />
    </Provider>
  );

  // return (
  //   <I18nextProvider i18n={i18n}>
  //           <Provider {...stores}>
  //             <Main history={history} />
  //           </Provider>
  //   </I18nextProvider>
  // );

  async function loadStoresAndLocales() {
    const loadedStores = await loadStores();
    setAllStores(loadedStores);
  }

};

async function loadStores(): Promise<Stores> {
  // Init rest of stores, (MobX requires all stores are instantiated immediately)
  return {
    [DataStore.UI]: new UIStore(),
  };
}


export default App;