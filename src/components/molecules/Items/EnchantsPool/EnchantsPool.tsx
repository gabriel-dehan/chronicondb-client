import React, { FunctionComponent, useState } from 'react';
import replaceWithJSX from 'react-string-replace';

import { pickBy, map, camelCase, isString } from 'lodash';

import Tabs from 'components/molecules/Tabs/Tabs';
import useEngine from 'hooks/useEngine';
import { CraftableEnchantTypes, EnchantType, Enchant } from 'types/Enchant.types';
import { ItemType, ItemRarity } from 'types/Item.types';

import './EnchantsPool.scss';

interface Props {
  type: ItemType,
}

const EnchantsPool: FunctionComponent<Props> = ({
  type,
}) => {
  const Engine = useEngine();
  const enchantsPool = Engine.Enchants.getTypeEnchantsPool(type);
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
                <div key={`pool-${enchantType}`}>
                  {renderPoolForType(enchantType)}
                </div>
              );
            })}
          </Tabs>

        </div>
      ) : (
        <div className="m-enchantsPool__none">
          {type}s are not enchantable
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

      return (
        <div
          key={`epool-${type}-${enchant.uuid}`}
          className={`m-enchantsPool__enchant etype-${type.toLowerCase()} ${isSelected ? 'expanded' : ''}`}
        >
          <span
            className="m-enchantsPool__enchant-name"
            onClick={() => setCurrentEnchant(isSelected ? null : enchant)}
          >
            {enchant.name}
          </span>
          {isSelected && (
            <div className="m-enchantsPool__enchant__data">
              <strong className="m-enchantsPool__enchant__data-description">
                {renderDescription(enchant)}
              </strong>
              {map(enchant.ranges, (rolls, rarity) => {
                if (rarity === ItemRarity.Mythical) {
                  return null;
                }

                return (
                  <div key={`epool-rolls-${rarity}`} className="m-enchantsPool__enchant__rolls">
                    <strong
                      className="m-enchantsPool__enchant__rolls-rarity"
                      style={{ color: `var(--color-item-${camelCase(rarity)})` }}
                    >
                      {rarity}
                    </strong>
                    <ul>
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
                );
              }).reverse()}

            </div>
          )}
        </div>
      );
    });
  }

  // TODO: Refactor with AppliedEnchant
  function renderDescription(enchant: Enchant) {
    const replacedRanges = replaceWithJSX(enchant.description, /(AMOUNT)/, (_, i) => {
      return (
        <span
          key={`tpl-${enchant.uuid}-enchant-${enchant.name}-${i}`}
          className="m-enchantsPool__enchant__data-description-amount"
        >
          X
        </span>
      );
    });

    // Just add a `-` at the beginning of the string if there is no `+`
    if (replacedRanges && isString(replacedRanges[0]) && !replacedRanges[0].match(/^\+/)) {
      replacedRanges[0] = `- ${replacedRanges[0]}`;
    }

    return replacedRanges;
  }
};

export default EnchantsPool;