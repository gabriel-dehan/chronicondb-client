import React, { FunctionComponent } from 'react';

import Search from 'components/atoms/Search/Search';
import useFilters from 'hooks/useFilters';
import { ArtifactsFilters, FiltersType } from 'types/Filters.types';

import './Filters.scss';

const Filters: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<ArtifactsFilters>(FiltersType.Artifacts);

  return (
    <div className="o-artifactsFilters">
      <Search
        className="o-artifactsFilters__search"
        placeholder="Search anything: Mana, Health, Pickup radius..."
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