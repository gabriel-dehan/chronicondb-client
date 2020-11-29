import React, { FunctionComponent, useMemo } from 'react';

import { camelCase } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import EnchantSlot from 'components/atoms/Items/EnchantSlot/EnchantSlot';
import useEngine from 'hooks/useEngine';
import { Item as ItemInterface, ItemType } from 'types/Item.types';

import './Item.scss';

interface Props {
  item: ItemInterface,
}

const Item: FunctionComponent<Props> = ({
  item,
}) => {
  const Engine = useEngine();
  const itemEnchants = useMemo(() => Engine.Enchants.getItemEnchantsSlots(item), [item]);

  console.log(itemEnchants);

  return (
    <div className="o-item__container">
      <div className="o-item">
        <div className="o-item__header">
          <div className="o-item__header-content">
            <span className="o-item__icon">
              {item.icon && (
                <GameIcon type={GameIconType.Item} name={item.icon} width={32} />
              )}
            </span>
            <div className="o-item__header-title">
              <h2 className="o-item__name">{item.name}</h2>
              <h3
                className="o-item__rarity"
                style={{ color: `var(--color-item-${camelCase(item.rarity)})` }}
              >
                {item.rarity} {item.type}
              </h3>
            </div>
          </div>
          <div className="o-item__header-req">
            <span>
              LVL. {item.minLevel}
            </span>
            <span>
              {item.classRestriction || 'Any Class'}
            </span>
          </div>
        </div>
        <div className="o-item__enchantSlots__container">
          {itemEnchants && (
            <ul className="o-item__enchantSlots">
              {itemEnchants.enchantSlots?.map((slot, index) => {
                return !slot.categoriesRestriction || slot.categoriesRestriction.includes(item.category) ?
                  (
                    <EnchantSlot
                      key={`${item.uuid}-eslot-${index}`}
                      item={item}
                      enchantSlot={slot}
                    />
                  ) : (
                    null
                  );
              })}
              {[ItemType.Helm, ItemType.Armor, ItemType.Boots].includes(item.type) &&
                <li className="o-item__enchantSlots-replace">
                  <em className="o-item__enchantSlots-replace-chance">25%</em> chance to replace 1 <em style={{ color: 'var(--color-enchant-major)' }}>Major</em> with 1 <em style={{ color: 'var(--color-enchant-epic)' }}>Epic</em>
                </li>
              }

            </ul>
          )}
        </div>
        {item.set && (
          <div className="o-item__set">
            Set:
          </div>
        )}
      </div>
      <div className="o-item__enchants">
        Enchants
      </div>
    </div>
  );
};

export default Item;