import React, { Fragment, FunctionComponent, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { camelCase } from 'lodash';

import Badge from 'components/atoms/Badge/Badge';
import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import AppliedEnchant from 'components/molecules/Items/AppliedEnchant/AppliedEnchant';
import EnchantSlot from 'components/molecules/Items/EnchantSlot/EnchantSlot';
import ItemSet from 'components/molecules/Items/Set/Set';
import ItemDownloader from 'components/organisms/ItemDownloader/ItemDownloader';
import useEngine from 'hooks/useEngine';
import { RoutePath } from 'routes';
import { Item as ItemInterface, ItemCategory, ItemType } from 'types/Item.types';

import './DownloadableItem.scss';

interface Props {
  item: ItemInterface,
  setCollapsed?: boolean,
}

const Item: FunctionComponent<Props> = ({
  item,
  setCollapsed,
}) => {
  const Engine = useEngine();
  const itemEnchants = useMemo(() => Engine.Enchants.getItemEnchantsSlots(item), [item]);
  const itemSetData = useMemo(() => Engine.Items.getSetData(item), [item]);
  const classRestriction = item.classRestriction || 'Any Class';

  return (
    <div className="o-downloadableItem__container">
      <div className="o-downloadableItem">
        <div className="o-downloadableItem__header">
          <div className="o-downloadableItem__header-content">
            <span className="o-downloadableItem__icon">
              {item.icon && (
                <GameIcon type={GameIconType.Item} name={item.icon} width={32} />
              )}
            </span>
            <div className="o-downloadableItem__header-title">
              <h2 className="o-downloadableItem__name">
                <Link to={RoutePath.Item.replace(':uuid', item.uuid.toString())} className="o-downloadableItem__header-title-link" target="__blank">
                  {item.name}
                </Link>
                <ItemDownloader item={item} />
              </h2>
              <h3
                className="o-downloadableItem__rarity"
                style={{ color: `var(--color-item-${camelCase(item.rarity)})` }}
              >
                {item.rarity} {item.type}
              </h3>
            </div>
          </div>
          <div className="o-downloadableItem__header-req">
            <Badge
              label={classRestriction}
              color={`var(--color-class-${camelCase(classRestriction)})`}
            />
            <span>
              LVL. {item.minLevel}
            </span>
          </div>
        </div>
        <div className="o-downloadableItem__content">
          {item.description && (
            <div className="o-downloadableItem__description">
              {item.description}
            </div>
          )}
          {itemEnchants &&
            <div className="o-downloadableItem__enchants">
              {renderBaseEnchants()}
              <div className="o-downloadableItem__enchants__slotsContainer">
                {renderFixedEnchants()}
                {renderEnchantsSlots()}
              </div>
            </div>
          }
          {item.flavor && (
            <div className="o-downloadableItem__flavor">
              {item.flavor}
            </div>
          )}
        </div>
        {itemSetData && (
          <div className="o-downloadableItem__set">
            <ItemSet set={itemSetData} setCollapsed={setCollapsed} />
          </div>
        )}
      </div>
    </div>
  );

  function renderBaseEnchants() {
    return itemEnchants && itemEnchants.baseEnchants?.length > 0 && (
      <ul className="o-downloadableItem__enchants__base">
        {itemEnchants.baseEnchants?.map((enchant, index) => (
          <AppliedEnchant
            key={`${item.uuid}-ebase-${index}`}
            item={item}
            enchant={enchant}
          />
        ))}
      </ul>
    );
  }

  function renderFixedEnchants() {
    const isGem = item.category === ItemCategory.Gem;
    // TODO: Extract to a proper dataMapping
    const enchantForType = ['Weapon/Offhand', 'Helm/Armor/Boots', 'Amulet/Ring/Accessory'];

    return itemEnchants && (
      <ul className="o-downloadableItem__enchants__fixed">
        {itemEnchants.fixedEnchants?.map((enchant, index) => (
          <Fragment key={`fr-${item.uuid}-fbase-${index}`}>
            {isGem && <span className="o-downloadableItem__enchants__fixed-label">{enchantForType[index]}</span>}
            <AppliedEnchant
              item={item}
              key={`${item.uuid}-fbase-${index}`}
              enchant={enchant}
            />
          </Fragment>
        ))}
      </ul>
    );
  }

  function renderEnchantsSlots() {
    return itemEnchants && (
      <ul className="o-downloadableItem__enchants__slots">
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
          <li className="o-downloadableItem__enchants__slots-replace">
            <em className="o-downloadableItem__enchants__slots-replace-chance">25%</em> chance to replace 1 <em style={{ color: 'var(--color-enchant-major)' }}>Major</em> with 1 <em style={{ color: 'var(--color-enchant-epic)' }}>Epic</em>
          </li>
        }
      </ul>
    );
  }
};

export default Item;