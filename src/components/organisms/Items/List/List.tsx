import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Header from 'components/molecules/Items/Header/Header';
import Item from 'components/organisms/Items/Item/Item';
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
  const Engine = useEngine();

  const items = getFilteredItems();

  return (
    <div className="o-itemsList">
      {items.length > 0 ? (
        <>
          <Header />
          <div className="o-itemsList__items">
            {items.map(item => (
              <Item key={`item-${item.uuid}`} item={item} />
            ))}
          </div>
        </>
      ) : (
        <div className="o-itemsList__noItem">
          No item were found matching these criteria.
        </div>
      )}

    </div>
  );

  function getFilteredItems() {
    return Engine.Items.all({
      search: filtersStore.items.search,
      category: filtersStore.items.category,
      type: filtersStore.items.type,
      characterClass: filtersStore.items.characterClass,
      rarities: filtersStore.items.rarities,
      onlySet: filtersStore.items.onlySet,
    });
  }
};

export default observer(List);