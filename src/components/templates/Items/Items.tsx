import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Header from 'components/molecules/Items/Header/Header';
import Categories from 'components/organisms/Items/Categories/Categories';
import Filters from 'components/organisms/Items/Filters/Filters';
import List from 'components/organisms/Items/List/List';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

import './Items.scss';

interface Stores {
  filtersStore: FiltersStore;
}

const Items: FunctionComponent = () => {
  const { filtersStore: { currentPatch } } = useStores<Stores>(DataStore.Filters);

  console.log(currentPatch);

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