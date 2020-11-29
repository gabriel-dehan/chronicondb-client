import React, { FunctionComponent } from 'react';
import replaceWithJSX from 'react-string-replace';

import { isString } from 'lodash';

import { SimpleEnchant } from 'types/Enchant.types';

import './AppliedEnchant.scss';

interface Props {
  enchant: SimpleEnchant;
}

const AppliedEnchant: FunctionComponent<Props> = ({
  enchant,
}) => {
  return (
    <li className="a-appliedEnchant">
      {descriptionToTemplate()}
    </li>
  );

  function descriptionToTemplate() {
    let finalNodes = null;

    const replacedRanges = replaceWithJSX(enchant.description, /(AMOUNT)/, (_, i) => {
      return (
        <span
          key={`tpl-enchant-${enchant.name}-${i}`}
          className="a-appliedEnchant__range"
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
              key={`tpl-skill-${enchant.name}-${i}`}
              className="a-appliedEnchant__skill"
            >
              {skillName}
            </a>
          );
        } else {
          return (
            <a
              href={`/skills?uuid=${skillId}`}
              key={`tpl-skill-${enchant.name}-${i}`}
              className="a-appliedEnchant__skill unknown"
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
        <em className="a-appliedEnchant__max">{enchant.max}</em>
      );
    } else {
      return (
        <>
          [<em className="a-appliedEnchant__min">{enchant.min}</em>-<em className="a-appliedEnchant__max">{enchant.max}</em>]
        </>
      );
    }
  }
};

export default AppliedEnchant;