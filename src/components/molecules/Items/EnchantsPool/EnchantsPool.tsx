import React, { FunctionComponent, useState } from 'react';

import { pickBy } from 'lodash';

import Tabs from 'components/molecules/Tabs/Tabs';
import useEngine from 'hooks/useEngine';
import { CraftableEnchantTypes, EnchantType, Enchant } from 'types/Enchant.types';
import { Item } from 'types/Item.types';

import './EnchantsPool.scss';

interface Props {
  item: Item,
}

const EnchantsPool: FunctionComponent<Props> = ({
  item,
}) => {
  const Engine = useEngine();
  const enchantsPool = Engine.Enchants.getItemEnchantsPool(item);
  const availableEnchantTypes = (enchantsPool ?
    Object.keys(pickBy(enchantsPool, pool => pool.length > 0))
    : []
  ) as CraftableEnchantTypes[];
  const [currentEnchant, setCurrentEnchant] = useState<Enchant | null>(null);

  return (
    <div className="m-enchantsPool">
      {enchantsPool ? (
        <div className="m-enchantsPool__content">
          <Tabs
            defaultItem={Math.floor((availableEnchantTypes.length - 1) / 2)}
            navItems={availableEnchantTypes.map(enchantType => ({
              label: enchantType,
              color: `var(--color-enchant-${enchantType.toLowerCase()})`,
              borderColor: enchantType === EnchantType.Minor ?
                'var(--color-element-mid-beige)' :
                `var(--color-enchant-${enchantType.toLowerCase()})`,
              hoverColor: `var(--color-enchant-dim-${enchantType.toLowerCase()})`,
            }))}
          >
            {availableEnchantTypes.map((enchantType) => {
              return (
                <>
                  {renderPoolForType(enchantType)}
                </>
              );
            })}
          </Tabs>

        </div>
      ) : (
        <div className="m-enchantsPool__none">
          Not enchantable
        </div>
      )}
    </div>
  );

  function renderPoolForType(type: CraftableEnchantTypes) {
    if (!enchantsPool) {
      return null;
    }

    return enchantsPool[type].map((enchant) => {
      const isSelected = currentEnchant?.uuid === enchant.uuid;
      const rolls = enchant.ranges[item.rarity];

      return (
        <div
          key={`epool-${item.uuid}-${enchant.uuid}`}
          className={`m-enchantsPool__enchant etype-${type.toLowerCase()} ${isSelected ? 'expanded' : ''}`}
          onClick={() => setCurrentEnchant(isSelected ? null : enchant)}
        >
          <span className="m-enchantsPool__enchant-name">
            {enchant.name}
          </span>
          {isSelected && (
            <div className="m-enchantsPool__enchant__data">
              <strong className="m-enchantsPool__enchant__data-description">
                {enchant.description}
              </strong>
              <ul className="m-enchantsPool__enchant__rolls">
                <li className="m-enchantsPool__enchant__roll">
                  <span className="m-enchantsPool__enchant__roll-header">
                    Roll range
                  </span>
                  <em className="m-enchantsPool__enchant__roll-roll">
                    {rolls.minimum} - {rolls.maximum}
                  </em>
                </li>
                <li className="m-enchantsPool__enchant__roll">
                  <span className="m-enchantsPool__enchant__roll-header">
                    Augment caps
                  </span>
                  <em className="m-enchantsPool__enchant__roll-roll">
                    {rolls.cap} - {rolls.greaterCap}
                  </em>
                </li>
              </ul>
            </div>
          )}
        </div>
      );
    });
  }
};

export default EnchantsPool;