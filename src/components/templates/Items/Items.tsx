import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Header from 'components/molecules/Items/Header/Header';
import Categories from 'components/organisms/Items/Categories/Categories';
import Filters from 'components/organisms/Items/Filters/Filters';
import List from 'components/organisms/Items/List/List';
import { useStores } from 'hooks/useStores';
import { UIStore } from 'stores/UIStore';
import { DataStore } from 'types/DataStore.types';

import './Items.scss';

interface Stores {
  uiStore: UIStore;
}

const Items: FunctionComponent = () => {
  const { uiStore } = useStores<Stores>(DataStore.UI);

  return (
    <>
      <Filters />
      <div className="t-items__wrapper">
        <Categories />
        <div className="t-items__list">
          <Header />
          <List />
        </div>
      </div>
    </>
  );
};

export default observer(Items);