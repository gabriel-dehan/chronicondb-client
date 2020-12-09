import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import replaceWithJSX from 'react-string-replace';

import { camelCase, isString } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import { allEnumValues } from 'helpers/typeUtils';
import useEngine from 'hooks/useEngine';
import { RoutePath } from 'routes';
import { Skill as SkillInterface, SkillTree, SkillFamily, SkillType } from 'types/Skill.types';

import './Skill.scss';

const SKILLS_TEMPLATE_REGEX = /\|((?:\w|'|\s|\|?)+)¥/g;
const DAMAGE_TYPES_TEMPLATE_REGEX = /(?:XDAM\s?)?_\w{3}_(\w+)¥/g;
const VALUES_TEMPLATE_REGEX = /(EFFECT|DURATION|DAMAGE|VALUE2|VALUE|PROC|RANGE2|RANGE)/g;
const GENERIC_REPLACE_REGEX = /(?:\||~)((?:\w|\.|'|-|%|\s)+)¥/g;
const SINGLE_REPLACE_REGEX = /\|(\w+)/g;

// TODO: Add this in the skills parser, automatically
const DEFAULT_MASTERY_VALUE = 10;
const DEFAULT_VALUE2 = 3;

const SKILL_FAMILIES = allEnumValues(SkillFamily);

interface Props {
  skill: SkillInterface,
}

const Skill: FunctionComponent<Props> = ({
  skill,
}) => {
  // Mastery skills can share the same UUID
  const safeUuid = `${skill.uuid}-${skill.class.toLowerCase()}`;
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
              <Link
                to={{
                  pathname: RoutePath.Skill.replace(':uuid', skill.uuid.toString()),
                  search: `?skillCharacterClass=${skill.class}`,
                }}
                className="o-skill__header-title-link"
                target="__blank"
              >
                {skill.name}
              </Link>
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
            {renderDescription()}
          </div>
        </div>
      </div>
    </div>
  );

  // TODO: Refactor in useTemplateResolver (skill, amount, effect, etc...) that can be used elsewhere
  function renderDescription() {
    let finalNodes = null;
    let replacementCounter = 0; // Fuck react unique keys

    finalNodes = replaceWithJSX(skill.description, SKILLS_TEMPLATE_REGEX, (match, i, offset) => {
      replacementCounter++;
      const skillName = match.replace(/\|/g, '');
      const skillId = Engine.Skills.findByName(skillName)?.uuid;

      if (skillId) {
        return (
          <Link
            to={RoutePath.Skill.replace(':uuid', skillId.toString())}
            key={`tpl-${safeUuid}-skill-${skillId}-${i}-${offset}`}
            className="o-skill__description-skill-spell"
          >
            {skillName}
          </Link>
        );
      // It's a skill family
      } else if (SKILL_FAMILIES.includes(skillName as SkillFamily)) {
        return (
          // TODO: In search add `skillsTree=Any&characterClass=CURRENT`
          <Link
            to={{ pathname: RoutePath.Skills, search: `?skillsFamily=${skillName}` }}
            key={`tpl-${safeUuid}-skill-${skillId}-${i}-${offset}`}
            className="o-skill__description-skill-spell family"
          >
            {skillName}
          </Link>
        );
      // @ts-ignore
      } else if (SkillType[skillName]) {
        return (
          // TODO: In search add `skillsTree=Any&characterClass=CURRENT`
          <Link
            to={{ pathname: RoutePath.Skills, search: `?skillsTypes=${skillName}` }}
            key={`tpl-${safeUuid}-skill-${skillId}-${i}-${offset}`}
            className="o-skill__description-skill-spell type"
          >
            {skillName}
          </Link>
        );
      } else {
        return (
          <em
            key={`tpl-${safeUuid}-skill-${skillId}-${i}-${offset}`}
            className="o-skill__description-skill-spell unknown"
          >
            {skillName}
          </em>
        );
      }
    });

    finalNodes = replaceWithJSX(finalNodes, DAMAGE_TYPES_TEMPLATE_REGEX, (match, i, offset) => {
      replacementCounter++;
      const damageTypeId = match.toLowerCase();

      return (
        <span
          key={`tpl-skill-${safeUuid}-dt-${damageTypeId}-${i}-${offset}-${replacementCounter}`}
          style={{ color: `var(--color-damage-type-${damageTypeId})` }}
          className="o-skill__description-skill-damageType"
        >
          {match}
        </span>
      );
    });

    finalNodes = replaceWithJSX(finalNodes, VALUES_TEMPLATE_REGEX, (match, i, offset) => {
      replacementCounter++;
      const valueType = match.toLowerCase();
      const key = `tpl-skill-${safeUuid}-vals-${valueType}-${i}-${offset}-${replacementCounter}`;

      // @ts-ignore
      const values: Array<string | number> = skill[valueType] || [];

      // VALUE2 seems to be hardcoded
      if (valueType === 'value2' && values.length === 0) {
        values.push(DEFAULT_VALUE2);
      } else if (values.length === 0) {
        // Some masteries don't come with values even tho they should, so we use the DEFAULT_MASTERY_VALUE
        values.push(DEFAULT_MASTERY_VALUE);
      }

      return (
        <span
          key={key}
          className="o-skill__description-skill-values"
        >
          {values.length > 6 ? renderRange(values) : renderValues(values, key)}
        </span>
      );
    });

    finalNodes = replaceWithJSX(finalNodes, '|Use:¥', (match, i, offset) => {
      replacementCounter++;

      return (
        <strong
          key={`tpl-skill-${safeUuid}-use-${i}-${offset}-${replacementCounter}`}
          className="o-skill__description-skill-onUse"
        >
          <br/>Use:
        </strong>
      );
    });

    finalNodes = replaceWithJSX(finalNodes, GENERIC_REPLACE_REGEX, (match, i, offset) => {
      replacementCounter++;

      return (
        <strong
          key={`tpl-skill-${safeUuid}-simpleValue-${i}-${offset}-${replacementCounter}`}
          className="o-skill__description-skill-simpleValue"
        >
          {match}
        </strong>
      );
    });

    finalNodes = replaceWithJSX(finalNodes, SINGLE_REPLACE_REGEX, (match, i, offset) => {
      replacementCounter++;

      // TODO: Same color as spell unknown, spell unknown should be a different color than links
      return (
        <em
          key={`tpl-skill-${safeUuid}-singleValue-${i}-${offset}-${replacementCounter}`}
          className="o-skill__description-skill-singleValue"
        >
          {match}
        </em>
      );
    });

    finalNodes = replaceWithJSX(finalNodes, 'REQUIRED', (match, i, offset) => {
      replacementCounter++;

      return (
        <strong
          key={`tpl-skill-${safeUuid}-required-${i}-${offset}-${replacementCounter}`}
          className="o-skill__description-skill-required"
        >
          The previously selected skill
        </strong>
      );
    });

    return finalNodes;
  }

  function renderValues(values: Array<string | number>, key: string) {
    const valueNodes = values.map<React.ReactNode>((value, index) => {
      const val = isString(value) ? parseInt(value) : value;
      return (
        <em key={`${key}-${value}-${index}`} className="o-skill__description-skill-value">
          {val}
        </em>
      );
    });

    if (valueNodes.length === 1) {
      return valueNodes;
    } else {
      return (
        <>
          [
          {valueNodes.reduce((prev, curr) => [prev, ' / ', curr])}
          ]
        </>
      );
    }

  }

  function renderRange(values: Array<string | number>) {
    const min = isString(values[0]) ? parseInt(values[0]) : values[0];
    let max = values[values.length - 1];
    max = isString(max) ? parseInt(max) : max;

    if (min === max) {
      return (
        <em className="o-skill__description-skill-valueRange-max">{max}</em>
      );
    } else {
      return (
        <>
          [
          <em className="o-skill__description-skill-valueRange-min">{min}</em>
          -
          <em className="o-skill__description-skill-valueRange-max">{max}</em>
          ]
        </>
      );
    }
  }
};

export default Skill;