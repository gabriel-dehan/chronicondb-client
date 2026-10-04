import React, { FunctionComponent } from 'react';

import Dropdown from 'components/atoms/Dropdown/Dropdown';
import Search from 'components/atoms/Search/Search';
import { allEnumValues } from 'helpers/typeUtils';
import useFilters from 'hooks/useFilters';
import { BlessingKind, BlessingSlot } from 'types/Blessing.types';
import { CharacterClass } from 'types/Character.types';
import { BlessingsFilters, FiltersType } from 'types/Filters.types';

import './Filters.scss';

interface Props {
  kind: BlessingKind;
}

const slotOptions = ['All', ...allEnumValues(BlessingSlot)].map(slot => ({
  label: slot === 'All' ? 'Any slot' : slot,
  value: slot,
}));

const classOptions = allEnumValues(CharacterClass).map(characterClass => ({
  label: characterClass === CharacterClass.All ? 'Any class' : characterClass,
  value: characterClass,
}));

const Filters: FunctionComponent<Props> = ({ kind }) => {
  const [filters, setFilters] = useFilters<BlessingsFilters>(FiltersType.Blessings);

  return (
    <div className="o-blessingsFilters">
      <Search
        className="o-blessingsFilters__search"
        placeholder="Search anything: Health, Doublecast, Mana..."
        value={filters.search || ''}
        onChange={search => setFilters({ search })}
      />
      <Dropdown
        className="o-blessingsFilters__dropdown"
        label=""
        defaultValue={filters.slot || 'All'}
        options={slotOptions}
        onChange={slot => setFilters({ slot })}
      />
      {kind === BlessingKind.Blessings && (
        <Dropdown
          className="o-blessingsFilters__dropdown"
          label=""
          defaultValue={filters.characterClass || CharacterClass.All}
          options={classOptions}
          onChange={characterClass => setFilters({ characterClass })}
        />
      )}
    </div>
  );
};

export default Filters;
