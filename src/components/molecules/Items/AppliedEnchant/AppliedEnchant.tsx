import React, { FunctionComponent } from 'react';
import replaceWithJSX from 'react-string-replace';

import { isString } from 'lodash';

import { SimpleEnchant } from 'types/Enchant.types';
import { Item } from 'types/Item.types';

import './AppliedEnchant.scss';

interface Props {
  item: Item
  enchant: SimpleEnchant;
}

const AppliedEnchant: FunctionComponent<Props> = ({
  item,
  enchant,
}) => {
  return (
    <li className="m-appliedEnchant">
      {descriptionToTemplate()}
    </li>
  );

  // TODO: Refactor with EnchantsPool
  function descriptionToTemplate() {
    let finalNodes = null;

    const replacedRanges = replaceWithJSX(enchant.description, /(AMOUNT)/, (_, i) => {
      return (
        <span
          key={`tpl-${item.uuid}-enchant-${enchant.name}-${i}`}
          className="m-appliedEnchant__range"
        >
          {renderRange()}
        </span>
      );
    });

    if (enchant.skills) {
      const replacedSkills = replaceWithJSX(replacedRanges, /<SKILL_(\d+)>/g, (match, i) => {
        const skillId = parseInt(match);
        const skillName = enchant.skills ? enchant.skills[skillId] : null;
        if (skillName) {
          return (
            <a
              href={`/skills?uuid=${skillId}`}
              key={`tpl-${item.uuid}-skill-${skillId}-${i}`}
              className="m-appliedEnchant__skill"
            >
              {skillName}
            </a>
          );
        } else {
          return (
            <a
              href={`/skills?uuid=${skillId}`}
              key={`tpl-${item.uuid}-skill-${skillId}-${i}`}
              className="m-appliedEnchant__skill unknown"
            >
              Unknown Skill
            </a>
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

  function renderRange() {
    if (enchant.min === enchant.max) {
      return (
        <em className="m-appliedEnchant__max">{enchant.max}</em>
      );
    } else {
      return (
        <>
          [<em className="m-appliedEnchant__min">{enchant.min}</em>-<em className="m-appliedEnchant__max">{enchant.max}</em>]
        </>
      );
    }
  }
};

export default AppliedEnchant;