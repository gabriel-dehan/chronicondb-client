import React, { FunctionComponent, useMemo } from 'react';

import { camelCase } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import AppliedEnchant from 'components/atoms/Items/AppliedEnchant/AppliedEnchant';
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
        <div className="o-item__content">
          {item.description && (
            <div className="o-item__description">
              {item.description}
            </div>
          )}
          {itemEnchants &&
            <div className="o-item__enchants">
              {renderBaseEnchants()}
              <div className="o-item__enchants__slotsContainer">
                {renderFixedEnchants()}
                {renderEnchantsSlots()}
              </div>
            </div>
          }
        </div>
        {item.set && (
          <div className="o-item__set">
            Set:
          </div>
        )}
      </div>
      <div className="o-item__possibleEnchants">
        Enchants
      </div>
    </div>
  );

  function renderBaseEnchants() {
    return itemEnchants && itemEnchants.baseEnchants?.length > 0 && (
      <ul className="o-item__enchants__base">
        {itemEnchants.baseEnchants?.map((enchant, index) => (
          <AppliedEnchant
            key={`${item.uuid}-ebase-${index}`}
            enchant={enchant}
          />
        ))}
      </ul>
    );
  }

  function renderFixedEnchants() {
    return itemEnchants && (
      <ul className="o-item__enchants__fixed">
        {itemEnchants.fixedEnchants?.map((enchant, index) => (
          <AppliedEnchant
            key={`${item.uuid}-fbase-${index}`}
            enchant={enchant}
          />
        ))}
      </ul>
    );
  }

  function renderEnchantsSlots() {
    return itemEnchants && (
      <ul className="o-item__enchants__slots">
        {itemEnchants.enchantSlots?.map((slot, index) => {
          return (!slot.categoriesRestriction || slot.categoriesRestriction.includes(item.category)) && (
            <EnchantSlot
              key={`${item.uuid}-eslot-${index}`}
              item={item}
              enchantSlot={slot}
            />
          );
        })}
        {[ItemType.Helm, ItemType.Armor, ItemType.Boots].includes(item.type) &&
          <li className="o-item__enchants__slots-replace">
            <em className="o-item__enchants__slots-replace-chance">25%</em> chance to replace 1 <em style={{ color: 'var(--color-enchant-major)' }}>Major</em> with 1 <em style={{ color: 'var(--color-enchant-epic)' }}>Epic</em>
          </li>
        }
      </ul>
    );
  }
};

export default Item;