import React, { FunctionComponent } from 'react';

import Dropdown from 'components/atoms/Dropdown/Dropdown';
import Multiselect, { MultiselectOption } from 'components/atoms/Multiselect/Multiselect';
import Search from 'components/atoms/Search/Search';
import { allEnumValues } from 'helpers/typeUtils';
import useFilters from 'hooks/useFilters';
import { SkillsFilters, FiltersType } from 'types/Filters.types';
import { SkillType, SkillFamily } from 'types/Skill.types';

import './Filters.scss';

const Filters: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<SkillsFilters>(FiltersType.Skills);
  const skillTypes = allEnumValues(SkillType);

  const typesOptions: MultiselectOption[] = skillTypes.map(type => ({
    label: type,
    value: type,
    color: `var(--color-element-orange)`,
  }));

  const familyOptions = [...['All'], ...allEnumValues(SkillFamily)].map(family => ({
    label: family === 'All' ? 'Any family' : family,
    value: family,
  }));

  return (
    <div className="o-skillFilters">
      <Search
        className="o-skillFilters__search"
        placeholder="Search anything: Fire, Movement, Tornado..."
        value={filters.search || ''}
        onChange={onSearchChange}
      />
      <Multiselect
        className="o-skillFilters__typeSelect"
        defaultValues={filters.types ? filters.types : skillTypes}
        options={typesOptions}
        onChange={onTypesSelect}
      />
      <Dropdown
        className="o-skillFilters__familyDropdown"
        label=""
        defaultValue={filters.family || 'All'}
        options={familyOptions}
        onChange={onFamilySelect}
      />
    </div>
  );

  function onTypesSelect(types: string[]) {
    setFilters({ types });
  }

  function onFamilySelect(family: string) {
    setFilters({ family });
  }

  function onSearchChange(search?: string) {
    setFilters({ search });
  }
};

export default Filters;