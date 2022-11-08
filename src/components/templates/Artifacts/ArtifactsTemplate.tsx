import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Categories from 'components/organisms/Artifacts/Categories/Categories';
import Filters from 'components/organisms/Artifacts/Filters/Filters';
import List from 'components/organisms/Artifacts/List/List';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';
import './ArtifactsTemplate.scss';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const ArtifactsTemplate: FunctionComponent = () => {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const Engine = useEngine();

  const artifacts = getFilteredArtifacts();

  return (
    <>
      <Filters />
      <div className="t-artifacts__wrapper">
        <Categories />
        <div className="t-artifacts__list">
          <List artifacts={artifacts} />
        </div>
      </div>
    </>
  );

  function getFilteredArtifacts() {
    return Engine.Artifacts.all({
      search: filtersStore.artifacts.search,
      type: filtersStore.artifacts.type,
    });
  }
};

export default observer(ArtifactsTemplate);