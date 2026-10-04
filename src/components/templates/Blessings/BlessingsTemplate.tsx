import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Categories from 'components/organisms/Blessings/Categories/Categories';
import Filters from 'components/organisms/Blessings/Filters/Filters';
import List from 'components/organisms/Blessings/List/List';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { BlessingKind } from 'types/Blessing.types';
import { DataStore } from 'types/DataStore.types';

import './BlessingsTemplate.scss';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const BlessingsTemplate: FunctionComponent = () => {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const Engine = useEngine();
  const filters = filtersStore.blessings;
  const kind = (filters.kind ?? Engine.Blessings.defaultKind) as BlessingKind;

  return (
    <>
      <Filters kind={kind} />
      <div className="t-blessings__wrapper">
        <Categories />
        <div className="t-blessings__list">
          {/* Keyed by kind so the paginated state is reset when switching between blessings and curses */}
          {kind === BlessingKind.Curses ? (
            <List key={kind} kind={kind} curses={Engine.Blessings.curses(filters)} />
          ) : (
            <List key={kind} kind={kind} blessings={Engine.Blessings.blessings(filters)} />
          )}
        </div>
      </div>
    </>
  );
};

export default observer(BlessingsTemplate);
