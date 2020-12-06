import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { camelCase } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import { Enchant as EnchantInterfacee, EnchantCategory, EnchantType } from 'types/Enchant.types';

import './Enchant.scss';

interface Props {
  enchant: EnchantInterfacee,
}

const Enchant: FunctionComponent<Props> = ({
  enchant,
}) => {
  const isGem = enchant.type === ('Gem' as EnchantType);
  // We put Gems enchants as Major Enchants
  const type = isGem ? EnchantType.Major : enchant.type;

  return (
    <div className="o-enchant">
      <div className="o-enchant__header">
        <div className="o-enchant__header-content">
          <span className="o-enchant__icon">
            <GameIcon type={GameIconType.EnchantType} name={type} width={32} />
          </span>
          <div className="o-enchant__header-title">
            <h2 className="o-enchant__header-name">
              {enchant.name}
            </h2>
            <h3
              className="o-enchant__header-category"
              style={{ color: `var(--color-enchant-${camelCase(type)})` }}
            >
              {isGem ? EnchantType.Major : type}
              &nbsp;
              {enchant.category === EnchantCategory.Enchant ? 'Item' : enchant.category} Enchant
            </h3>
          </div>
        </div>
      </div>
      <div className="o-enchant__content">
        {enchant.name}
        {enchant.description}
        ranges
        itemtypes
      </div>
    </div>
  );
};

export default Enchant;