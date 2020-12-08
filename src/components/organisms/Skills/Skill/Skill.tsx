import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import replaceWithJSX from 'react-string-replace';

import { camelCase, uniq } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import useEngine from 'hooks/useEngine';
import { Skill as SkillInterface, SkillTree } from 'types/Skill.types';

import './Skill.scss';

interface Props {
  skill: SkillInterface,
}

const Skill: FunctionComponent<Props> = ({
  skill,
}) => {
  const Engine = useEngine();

  return (
    <div className="o-skill">
      <div className="o-skill__header">
        <div className="o-skill__header-content">
          <span className="o-skill__icon">
            {skill.icon && (
              <GameIcon
                type={skill.tree === SkillTree.Mastery ? GameIconType.SkillMastery : GameIconType.SkillSpell}
                name={skill.icon}
                width={32}
              />
            )}
          </span>
          <div className="o-skill__header-title">
            <h2 className="o-skill__header-name">
              {skill.name}
            </h2>
            <h3
              className="o-skill__header-category"
              style={{ color: `var(--color-skill-${camelCase(skill.class)})` }}
            >
              {skill.class} - {skill.type} - {skill.tree} - {skill.family}
            </h3>
          </div>
        </div>
        <div className="o-skill__header-affixes">
        </div>
      </div>
      <div className="o-skill__content">
        <div className="o-skill__content-main">
          <div className="o-skill__description">
            {skill.description}
          </div>
        </div>
      </div>
    </div>
  );

  // // TODO: Refactor with AppliedEnchant and skill page
  // function renderDescription() {
  //   let finalNodes = null;

  //   const replacedRanges = replaceWithJSX(skill.description, /(AMOUNT)/, (_, i) => {
  //     return (
  //       <span
  //         key={`tpl-${skill.uuid}-skill-${skill.name}-${i}`}
  //         className="o-skill__description-skill-amount"
  //       >
  //         X
  //       </span>
  //     );
  //   });

  //   if (skill.skills) {
  //     const replacedSkills = replaceWithJSX(replacedRanges, /<SKILL_(\d+)>/g, (match, i, offset) => {
  //       const skillId = parseInt(match);
  //       const skillName = Engine.Skills.getSkillById(skillId)?.name;

  //       if (skillName) {
  //         return (
  //           <a
  //             href={`/skills?uuid=${skillId}`}
  //             key={`tpl-${skill.uuid}-skill-${skillId}-${i}-${offset}`}
  //             className="o-skill__description-skill-skill"
  //           >
  //             {skillName}
  //           </a>
  //         );
  //       } else {
  //         return (
  //           <a
  //             href={`/skills?uuid=${skillId}`}
  //             key={`tpl-${skill.uuid}-skill-${skillId}-${i}-${offset}`}
  //             className="o-skill__description-skill-skill unknown"
  //           >
  //             Unknown Skill
  //           </a>
  //         );
  //       }
  //     });

  //     finalNodes = replacedSkills;
  //   } else {
  //     finalNodes = replacedRanges;
  //   }

  //   return finalNodes;
  // }
};

export default Skill;