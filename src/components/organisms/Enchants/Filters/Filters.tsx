import React, { FunctionComponent } from 'react';

import Dropdown from 'components/atoms/Dropdown/Dropdown';
import Search from 'components/atoms/Search/Search';
import { allEnumValues } from 'helpers/typeUtils';
import useFilters from 'hooks/useFilters';
import { CharacterClass } from 'types/Character.types';
import { EnchantsFilters, FiltersType } from 'types/Filters.types';
import { ItemCategory } from 'types/Item.types';

import './Filters.scss';

interface Props {
  showRuneFilters: boolean;
}

// the equipment slots runes can roll on
const RUNE_SLOTS = [
  ItemCategory.Helmet,
  ItemCategory.Armor,
  ItemCategory.Boots,
  ItemCategory.Weapon,
  ItemCategory.Offhand,
  ItemCategory.Ring,
  ItemCategory.Amulet,
  ItemCategory.Accessory,
];

const slotOptions = ['All', ...RUNE_SLOTS].map(slot => ({
  label: slot === 'All' ? 'Any slot' : slot,
  value: slot,
}));

const classOptions = allEnumValues(CharacterClass).map(characterClass => ({
  label: characterClass === CharacterClass.All ? 'Any class' : characterClass,
  value: characterClass,
}));

const Filters: FunctionComponent<Props> = ({ showRuneFilters }) => {
  const [filters, setFilters] = useFilters<EnchantsFilters>(FiltersType.Enchants);

  return (
    <div className="o-enchantFilters">
      <Search
        className="o-enchantFilters__search"
        placeholder="Search anything: Health, Movement, Weapons..."
        value={filters.search || ''}
        onChange={onSearchChange}
      />
      {showRuneFilters && (
        <>
          <Dropdown
            className="o-enchantFilters__dropdown"
            label=""
            defaultValue={filters.slot || 'All'}
            options={slotOptions}
            onChange={slot => setFilters({ slot })}
          />
          <Dropdown
            className="o-enchantFilters__dropdown"
            label=""
            defaultValue={filters.characterClass || CharacterClass.All}
            options={classOptions}
            onChange={characterClass => setFilters({ characterClass })}
          />
        </>
      )}
    </div>
  );

  function onSearchChange(search?: string) {
    setFilters({ search });
  }
};

export default Filters;
