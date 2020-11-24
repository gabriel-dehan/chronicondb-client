import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Header from 'components/molecules/Items/Header/Header';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

import './List.scss';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const List: FunctionComponent = () => {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const Engine = useEngine('List');
  // const items = Engine.items.all(filtersStore.items);
  // console.log(items);
  return (
    <div className="o-itemsList">
      <Header />
      <div className="o-itemsList__items">

      </div>
    </div>
  );
};

export default observer(List);