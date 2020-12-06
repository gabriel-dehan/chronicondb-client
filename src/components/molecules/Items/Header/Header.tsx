import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import SortSelect from 'components/atoms/SortSelect/SortSelect';
import useFilters from 'hooks/useFilters';
import { ItemsFilters, FiltersType, SortOrder } from 'types/Filters.types';

import './Header.scss';

const Header: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<ItemsFilters>(FiltersType.Items);
  let nameSortOrder: 'asc' | 'desc' | null = null;
  let levelSortOrder: 'asc' | 'desc' | null = null;

  if (filters.orderBy && [SortOrder.NameAsc, SortOrder.NameDesc].includes(filters.orderBy)) {
    nameSortOrder = filters.orderBy === SortOrder.NameAsc ? 'asc' : 'desc';
  }

  if (filters.orderBy && [SortOrder.LevelAsc, SortOrder.LevelDesc].includes(filters.orderBy)) {
    levelSortOrder = filters.orderBy === SortOrder.LevelAsc ? 'asc' : 'desc';
  }

  return (
    <div className="m-header">
      <div className="m-header__items">
        <h3 className="m-header__thead">
          <SortSelect
            label="Item"
            currentOrder={nameSortOrder}
            onChange={() => orderBy(filters.orderBy === SortOrder.NameAsc ? SortOrder.NameDesc : SortOrder.NameAsc)}
          />
        </h3>
        <h3  className="m-header__thead req">
          <SortSelect
            label="Req."
            currentOrder={levelSortOrder}
            onChange={() => orderBy(filters.orderBy === SortOrder.LevelAsc ? SortOrder.LevelDesc : SortOrder.LevelAsc)}
          />
        </h3>
      </div>
      <div className="m-header__enchants">
        <h3 className="m-header__thead">Possible Enchants</h3>
      </div>
    </div>
  );

  function orderBy(orderBy: SortOrder) {
    setFilters({ orderBy });
  }
};

export default observer(Header);