import React, { FunctionComponent, useMemo } from 'react';

import { camelCase } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import useEngine from 'hooks/useEngine';
import { Item as ItemType } from 'types/Item.types';

import './Item.scss';

interface Props {
  item: ItemType,
}

const Item: FunctionComponent<Props> = ({
  item,
}) => {
  const Engine = useEngine();
  const itemEnchants = useMemo(() => Engine.Items.getEnchantsSlots(item), [item]);

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
          CONTENT
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