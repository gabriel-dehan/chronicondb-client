import React, { FunctionComponent } from 'react';

import Search from 'components/atoms/Search/Search';
import useFilters from 'hooks/useFilters';
import { EnchantsFilters, FiltersType } from 'types/Filters.types';

import './Filters.scss';

const Filters: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<EnchantsFilters>(FiltersType.Enchants);

  return (
    <div className="o-enchantFilters">
      <Search
        className="o-enchantFilters__search"
        placeholder="Search anything: Health, Movement, Weapons..."
        value={filters.search || ''}
        onChange={onSearchChange}
      />
    </div>
  );

  function onSearchChange(search?: string) {
    setFilters({ search });
  }
};

export default Filters;