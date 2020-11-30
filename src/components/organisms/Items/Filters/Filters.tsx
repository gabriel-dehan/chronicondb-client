import React, { FunctionComponent } from 'react';

import { camelCase } from 'lodash';

import CheckboxSelect from 'components/atoms/CheckboxSelect/CheckboxSelect';
import Dropdown from 'components/atoms/Dropdown/Dropdown';
import Multiselect, { MultiselectOption } from 'components/atoms/Multiselect/Multiselect';
import Search from 'components/atoms/Search/Search';
import { DEFAULT_RARITIES_FILTERS } from 'engine/EngineItems';
import { allEnumValues } from 'helpers/typeUtils';
import useFilters from 'hooks/useFilters';
import { CharacterClass } from 'types/Character.types';
import { ItemsFilters, FiltersType } from 'types/Filters.types';
import { ItemRarity } from 'types/Item.types';

import './Filters.scss';

const Filters: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<ItemsFilters>(FiltersType.Items);

  const raritiesOptions: MultiselectOption[] = allEnumValues(ItemRarity).map(rarity => ({
    label: rarity,
    value: rarity,
    color: `var(--color-item-${camelCase(rarity)})`,
  }));

  const classOptions = allEnumValues(CharacterClass).map(charClass => ({
    label: charClass === CharacterClass.All ? 'All classes' : charClass,
    value: charClass,
  }));

  return (
    <div className="o-filters">
      <Search
        placeholder="Search"
        value={filters.search || ''}
        onChange={onSearchChange}
      />
      <Multiselect
        defaultValues={filters.rarities ? filters.rarities : DEFAULT_RARITIES_FILTERS}
        options={raritiesOptions}
        onChange={onRaritiesSelect}
      />
      <CheckboxSelect
        className="o-filters__setCheckbox"
        selected={false}
        label="Only Sets"
        value="Set"
        color={`var(--color-item-set)`}
        onChange={onSetSelect}
      />
      <Dropdown
        className="o-filters__classDropdown"
        label=""
        defaultValue={filters.characterClass || CharacterClass.All}
        options={classOptions}
        onChange={onClassSelect}
      />

    </div>
  );

  function onRaritiesSelect(rarities: string[]) {
    setFilters({ rarities });
  }

  function onSetSelect(isSelected: boolean) {
    setFilters({ onlySet: isSelected });
  }

  function onClassSelect(characterClass: string) {
    setFilters({ characterClass });
  }

  function onSearchChange(search?: string) {
    setFilters({ search });
  }
};

export default Filters;