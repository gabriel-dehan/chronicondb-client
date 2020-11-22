import React, { FunctionComponent } from 'react';

import { camelCase } from 'lodash';

import Dropdown from 'components/atoms/Dropdown/Dropdown';
import Multiselect, { MultiselectOption } from 'components/atoms/Multiselect/Multiselect';
import Search from 'components/atoms/Search/Search';
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

  console.log(classOptions);

  return (
    <div className="o-filters">
      <Search
        placeholder="Search"
        value={filters.search || ''}
        onChange={search => setFilters({ search })}
      />
      <Multiselect
        defaultValues={filters.rarities ? filters.rarities : [ItemRarity.Unique, ItemRarity.Legendary, ItemRarity.TrueLegendary, ItemRarity.Set]}
        options={raritiesOptions}
        onChange={onRaritiesSelect}
      />
      <Dropdown
        className="o-filters__classDropdown"
        label=""
        defaultValue={CharacterClass.All}
        options={classOptions}
        onChange={onClassSelect}
      />

    </div>
  );

  function onRaritiesSelect(rarities: string[]) {
    setFilters({ rarities });
  }

  function onClassSelect(characterClass: string) {
    setFilters({ characterClass });
  }
};

export default Filters;