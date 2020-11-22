import React, { FunctionComponent } from 'react';


import { camelCase } from 'lodash';

import Multiselect, { MultiselectOption } from 'components/atoms/Multiselect/Multiselect';
import { allEnumValues } from 'helpers/typeUtils';
import useFilters from 'hooks/useFilters';
import { ItemRarity } from 'types/Item.types';

import './Filters.scss';

type Filters = {
  items: {
    rarities?: string[];
    search?: string;
    characterClass?: string;
  };
};

const Filters: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<Filters>();

  const raritiesOptions: MultiselectOption[] = allEnumValues(ItemRarity).map(rarity => ({
    label: rarity,
    value: rarity,
    color: `var(--color-item-${camelCase(rarity)})`,
  }));

  return (
    <div className="o-filters">
      Filters
      <Multiselect
        defaultValues={filters.items?.rarities ? filters.items.rarities : [ItemRarity.Unique, ItemRarity.Legendary, ItemRarity.TrueLegendary, ItemRarity.Set]}
        options={raritiesOptions}
        onChange={onRaritiesSelect}
      />
    </div>
  );

  function onRaritiesSelect(rarities: string[]) {
    setFilters({ items: { rarities } });
  }
};

export default Filters;