import React, { Fragment, FunctionComponent, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';

import { camelCase } from 'lodash';

import Badge from 'components/atoms/Badge/Badge';
import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import AppliedEnchant from 'components/molecules/Items/AppliedEnchant/AppliedEnchant';
import EnchantSlot from 'components/molecules/Items/EnchantSlot/EnchantSlot';
import ItemSet from 'components/molecules/Items/Set/Set';
import ItemDownloader from 'components/organisms/ItemDownloader/ItemDownloader';
import { ITEM_TYPES_WITH_EPIC_REPLACEMENT_CHANCE } from 'engine/EngineItems';
import useEngine from 'hooks/useEngine';
import useResponsive from 'hooks/useResponsive';
import { RoutePath } from 'routes';
import { CharacterClass } from 'types/Character.types';
import { Item as ItemInterface, ItemCategory, ItemRarity } from 'types/Item.types';

import './Item.scss';

interface Props {
  item: ItemInterface,
  setCollapsed?: boolean,
}

const Item: FunctionComponent<Props> = ({
  item,
  setCollapsed,
}) => {
  const { isUpToTablet } = useResponsive();
  const Engine = useEngine();
  const itemEnchants = useMemo(() => Engine.Enchants.getItemEnchantsSlots(item), [item]);
  const itemSetData = useMemo(() => Engine.Items.getSetData(item), [item]);
  const classRestriction = item.classRestriction || 'Any Class';

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
              <h2 className="o-item__name">
                <Link to={RoutePath.Item.replace(':uuid', item.uuid.toString())} className="o-item__header-title-link">
                  {item.name}
                </Link>
                <ItemDownloader item={item} />
              </h2>
              <h3
                className="o-item__rarity"
                style={{ color: `var(--color-item-${camelCase(item.rarity)})` }}
              >
                {item.rarity} {item.type}
              </h3>
            </div>
          </div>
          <div className="o-item__header-req">
            <span className="o-item__header-req-badge">
              {renderBadges(classRestriction)}
            </span>
            <span>
              LVL. {item.minLevel}
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
          {item.flavor && (
            <div className="o-item__flavor">
              {item.flavor}
            </div>
          )}
        </div>
        {itemSetData && (
          <div className="o-item__set">
            <ItemSet set={itemSetData} setCollapsed={setCollapsed} />
          </div>
        )}
      </div>
    </div>
  );

  function renderBadges(classRestriction: CharacterClass | 'Any Class') {
    // Mobile has less space
    if (isUpToTablet) {
      return (
        <Badge
          label={classRestriction}
          color={`var(--color-class-${camelCase(classRestriction)})`}
        />
      );
    }

    if (classRestriction === 'Any Class') {
      return (
        <Tooltip
          title={classRestriction}
          position="bottom"
          arrow={true}
          distance={5}
          offset={0}
          size="small"
        >
          {[CharacterClass.Templar, CharacterClass.Berserker, CharacterClass.Warlock, CharacterClass.Warden].map(charClass => (
            <GameIcon
              key={`item-${item.uuid}-req-class-${charClass.toLowerCase()}`}
              type={GameIconType.ClassProfile}
              name={charClass.toLowerCase()}
              height={28}
            />
          ))}
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          title={classRestriction}
          position="bottom"
          arrow={true}
          distance={5}
          offset={0}
          size="small"
        >
          <GameIcon
            type={GameIconType.ClassProfile}
            name={classRestriction.toLowerCase()}
            height={28}
          />
        </Tooltip>
      );
    }
  }

  function renderBaseEnchants() {
    return itemEnchants && itemEnchants.baseEnchants?.length > 0 && (
      <ul className="o-item__enchants__base">
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
      <ul className="o-item__enchants__fixed">
        {itemEnchants.fixedEnchants?.map((enchant, index) => (
          <Fragment key={`fr-${item.uuid}-fbase-${index}`}>
            {isGem && <span className="o-item__enchants__fixed-label">{enchantForType[index]}</span>}
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
        {ITEM_TYPES_WITH_EPIC_REPLACEMENT_CHANCE.includes(item.type) &&
         item.rarity !== ItemRarity.Ordinary &&
          <li className="o-item__enchants__slots-replace">
            <em className="o-item__enchants__slots-replace-chance">25%</em> chance to replace 1 <em style={{ color: 'var(--color-enchant-major)' }}>Major</em> with 1 <em style={{ color: 'var(--color-enchant-epic)' }}>Epic</em>
          </li>
        }
      </ul>
    );
  }
};

export default Item;