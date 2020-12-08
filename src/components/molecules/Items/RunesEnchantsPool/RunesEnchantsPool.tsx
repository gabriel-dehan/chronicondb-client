import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import replaceWithJSX from 'react-string-replace';

import { isString } from 'lodash';

import Tabs from 'components/molecules/Tabs/Tabs';
import useEngine from 'hooks/useEngine';
import { RoutePath } from 'routes';
import { EnchantType, Enchant } from 'types/Enchant.types';
import { ItemRarity } from 'types/Item.types';

import './RunesEnchantsPool.scss';

const EnchantsPool: FunctionComponent = () => {
  const Engine = useEngine();
  const enchantsPool = Engine.Enchants.getRunesEnchantsPool();
  const availableEnchantTypes = [EnchantType.Legendary];
  const [currentEnchant, setCurrentEnchant] = useState<Enchant | null>(null);

  return (
    <div className="m-runesEnchantsPool">
      <div className="m-runesEnchantsPool__content">
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
                {renderPool()}
              </div>
            );
          })}
        </Tabs>
      </div>
    </div>
  );

  function renderPool() {
    return enchantsPool.map((enchant) => {
      const isSelected = currentEnchant?.uuid === enchant.uuid;
      const rolls = enchant.ranges[ItemRarity.TrueLegendary];

      return (
        <div
          key={`epool-legendary-${enchant.uuid}`}
          className={`m-runesEnchantsPool__enchant etype-legendary ${isSelected ? 'expanded' : ''}`}
        >
          <span
            className="m-runesEnchantsPool__enchant-name"
            onClick={() => setCurrentEnchant(isSelected ? null : enchant)}
          >
            {enchant.name}
          </span>
          {isSelected && (
            <div className="m-runesEnchantsPool__enchant__data">
              <strong className="m-runesEnchantsPool__enchant__data-description">
                {renderDescription(enchant)}
              </strong>

              <div key={`epool-rolls-trueLegendary`} className="m-runesEnchantsPool__enchant__rolls">
                <ul>
                  <li className="m-runesEnchantsPool__enchant__roll">
                    <span className="m-runesEnchantsPool__enchant__roll-header">
                      Roll range
                    </span>
                    <em className="m-runesEnchantsPool__enchant__roll-roll">
                      {rolls.minimum} - {rolls.maximum}
                    </em>
                  </li>
                  <li className="m-runesEnchantsPool__enchant__roll">
                    <span className="m-runesEnchantsPool__enchant__roll-header">
                      Augment caps
                    </span>
                    <em className="m-runesEnchantsPool__enchant__roll-roll">
                      {rolls.cap} - {rolls.greaterCap}
                    </em>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      );
    });
  }

  // TODO: Refactor with AppliedEnchant and enchant page
  function renderDescription(enchant: Enchant) {
    let finalNodes = null;

    const replacedRanges = replaceWithJSX(enchant.description, /(AMOUNT)/, (_, i) => {
      return (
        <span
          key={`tpl-${enchant.uuid}-enchant-${enchant.name}-${i}`}
          className="m-runesEnchantsPool__enchant__data-description-amount"
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
              className="m-runesEnchantsPool__enchant__data-description-skill"
            >
              {skillName}
            </Link>
          );
        } else {
          return (
            <Link
              key={`tpl-${enchant.uuid}-skill-${skillId}-${i}-${offset}`}
              to={RoutePath.Skill.replace(':uuid', skillId.toString())}
              className="m-runesEnchantsPool__enchant__data-description-skill unknown"
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

    // Just add a `-` at the beginning of the string if there is no `+`
    if (finalNodes && isString(finalNodes[0]) && !finalNodes[0].match(/^\+/)) {
      finalNodes[0] = `- ${finalNodes[0]}`;
    }

    return finalNodes;
  }
};

export default EnchantsPool;