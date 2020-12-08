import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import replaceWithJSX from 'react-string-replace';

import { camelCase, uniq } from 'lodash';

import Badge from 'components/atoms/Badge/Badge';
import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import useEngine from 'hooks/useEngine';
import { RoutePath } from 'routes';
import { Enchant as EnchantInterfacee, EnchantCategory, EnchantType } from 'types/Enchant.types';
import { ItemRarity, ItemType } from 'types/Item.types';

import './Enchant.scss';

interface Props {
  enchant: EnchantInterfacee,
}

const Enchant: FunctionComponent<Props> = ({
  enchant,
}) => {
  const Engine = useEngine();
  const isGem = enchant.category === EnchantCategory.Gem;
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
        <div className="o-enchant__header-affixes">
          {enchant.affixes && uniq(enchant.affixes).map(affix => (
            <span
              key={`enchant-${enchant.uuid}-affix-${affix}`}
              className="o-enchant__header-affix"
            >
              <Badge
                label={affix}
                color={`var(--color-enchant-dim-${camelCase(type)})`}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="o-enchant__content">
        <div className="o-enchant__content-main">
          <div className="o-enchant__description">
            {renderDescription()}
          </div>
          <div className="o-enchant__ranges">
            {renderRanges()}
          </div>
        </div>
        <div className="o-enchant__content-sub">
          <h3 className="o-enchant__itemTypes-title">
            Can be applied to:
          </h3>
          <ul>
            {enchant.itemTypes.map(itemType => (
              <li
                key={`enchant-${enchant.uuid}-itemType-${itemType}`}
                className="o-enchant__itemType"
              >
                <Link to={{
                  pathname: '/items',
                  search: `?itemsType=${itemType}&itemsCategory=${Engine.Items.categoriesByType[itemType]}`,
                }}>
                  {itemType === ItemType.Rune ? 'Rune' : itemType}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  function renderRanges() {
    if (isGem) {
      return (
        <div className="o-enchant__ranges-column full">
          {renderRange(ItemRarity.Rare)}
          {renderRange(ItemRarity.Enchanted)}
          {renderRange(ItemRarity.Ordinary)}
        </div>
      );
    }

    return (
      <>
        <div className="o-enchant__ranges-column">
          {renderRange(ItemRarity.TrueLegendary)}
          {renderRange(ItemRarity.Legendary)}
          {renderRange(ItemRarity.Unique)}
        </div>
        <div className="o-enchant__ranges-column">
          {renderRange(ItemRarity.Rare)}
          {renderRange(ItemRarity.Enchanted)}
          {renderRange(ItemRarity.Ordinary)}
        </div>
      </>
    );
  }

  function renderRange(rarity: ItemRarity) {
    const rolls = enchant.ranges[rarity];

    return (
      <div key={`epool-rolls-${rarity}`} className="o-enchant__rolls">
        <strong
          className="o-enchant__rolls-rarity"
          style={{ color: `var(--color-item-${camelCase(rarity)})` }}
        >
          {rarity}
        </strong>
        <ul>
          <li className="o-enchant__roll">
            <span className="o-enchant__roll-header">
                Roll range
            </span>
            <em className="o-enchant__roll-roll">
              {rolls.minimum} - {rolls.maximum}
            </em>
          </li>
          <li className="o-enchant__roll">
            <span className="o-enchant__roll-header">
                Augment caps
            </span>
            <em className="o-enchant__roll-roll">
              {rolls.cap} - {rolls.greaterCap}
            </em>
          </li>
        </ul>
      </div>
    );
  }

  // TODO: Refactor with AppliedEnchant and enchant page
  function renderDescription() {
    let finalNodes = null;

    const replacedRanges = replaceWithJSX(enchant.description, /(AMOUNT)/, (_, i) => {
      return (
        <span
          key={`tpl-${enchant.uuid}-enchant-${enchant.name}-${i}`}
          className="o-enchant__description-enchant-amount"
        >
          X
        </span>
      );
    });

    if (enchant.skills) {
      const replacedSkills = replaceWithJSX(replacedRanges, /<SKILL_(\d+)>/g, (match, i, offset) => {
        const skillId = parseInt(match);
        const skillName = Engine.Skills.find(skillId)?.name;

        if (skillName) {
          return (
            <Link
              key={`tpl-${enchant.uuid}-skill-${skillId}-${i}-${offset}`}
              to={RoutePath.Skill.replace(':uuid', skillId.toString())}
              className="o-enchant__description-enchant-skill"
            >
              {skillName}
            </Link>
          );
        } else {
          return (
            <Link
              key={`tpl-${enchant.uuid}-skill-${skillId}-${i}-${offset}`}
              to={RoutePath.Skill.replace(':uuid', skillId.toString())}
              className="o-enchant__description-enchant-skill unknown"
            >
              Unknown Skill
            </Link>
          );
        }
      });

      finalNodes = replacedSkills;
    } else {
      finalNodes = replacedRanges;
    }

    return finalNodes;
  }
};

export default Enchant;