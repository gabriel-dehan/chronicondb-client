import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Categories from 'components/organisms/Items/Categories/Categories';
import Filters from 'components/organisms/Items/Filters/Filters';
import List from 'components/organisms/Items/List/List';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

import './ItemsTemplate.scss';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const ItemsTemplate: FunctionComponent = () => {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const Engine = useEngine();

  const items = getFilteredItems();

  return (
    <>
      <Filters />
      <div className="t-items__wrapper">
        <Categories />
        <div className="t-items__list">
          <List items={items} />
        </div>
      </div>
    </>
  );

  function getFilteredItems() {
    return Engine.Items.all({
      search: filtersStore.items.search,
      category: filtersStore.items.category,
      type: filtersStore.items.type,
      characterClass: filtersStore.items.characterClass,
      rarities: filtersStore.items.rarities,
      orderBy: filtersStore.items.orderBy,
      onlySet: filtersStore.items.onlySet,
    });
  }
};

export default observer(ItemsTemplate);