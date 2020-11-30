import React, { FunctionComponent } from 'react';

import { ItemEnchantSlot, EnchantType } from 'types/Enchant.types';
import { Item } from 'types/Item.types';

import './EnchantSlot.scss';

interface Props {
  item: Item;
  enchantSlot: ItemEnchantSlot;
}

const EnchantSlot: FunctionComponent<Props> = ({
  item,
  enchantSlot,
}) => {
  return (
    <li className="m-enchantSlot">
      +<em className="m-enchantSlot__count">{enchantSlot.count}</em>&nbsp;
      {formattedTypes()}&nbsp;
      {enchantSlot.count > 1 ? 'enchants' : 'enchant'}
    </li>
  );

  function formattedTypes() {
    const renderSlotType = (type: EnchantType) => (
      <em
        key={`${item.uuid}-slot-${type}`}
        className="m-enchantSlot__type"
        style={{ color: `var(--color-enchant-${type.toLowerCase()})` }}
      >
        {type}
      </em>
    );

    return enchantSlot
      .types
      .map<React.ReactNode>(renderSlotType)
      .reduce((prev, curr) => [prev, ' or ', curr]);
  }
};

export default EnchantSlot;