import React, { FunctionComponent } from 'react';
import './EnchantsTemplate.scss';

import { observer } from 'mobx-react';

import Categories from 'components/organisms/Enchants/Categories/Categories';
import Filters from 'components/organisms/Enchants/Filters/Filters';
import List from 'components/organisms/Enchants/List/List';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const EnchantsTemplate: FunctionComponent = () => {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const Engine = useEngine();

  const enchants = getFilteredEnchants();

  return (
    <>
      <Filters />
      <div className="t-enchants__wrapper">
        <Categories />
        <div className="t-enchants__list">
          <List enchants={enchants} />
        </div>
      </div>
    </>
  );

  function getFilteredEnchants() {
    return Engine.Enchants.all({
      search: filtersStore.enchants.search,
      type: filtersStore.enchants.type,
      category: filtersStore.enchants.category,
    });
  }
};

export default observer(EnchantsTemplate);