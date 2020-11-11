import { compact, reduce, map, isEmpty } from 'lodash';

import { CharacterClass } from '../../types/Character.types';
import { Skill, SkillTree, SkillFamily, SkillType, DamageElement } from '../../types/Skill.types';
import { readSourceFile, writeFile } from '../utils/fileUtils';

export function parseSkills(version: number, verbose = false) {
  // We remove the first line as it contains the version number
  const rawSkills = compact(readSourceFile(version, `skilldata_${version}.json`).split(/\n|\r/)).slice(1).join('\n');
  const skillsData = JSON.parse(rawSkills);
  const skills: Skill[] = [];

  // THIS IS HELL
  const skillsByClass = reduce(skillsData, (result: Record<string, any>, skillTree, characterClass) => {
    const parsedSkillTree = reduce(skillTree, (skillTreeResult: Record<string, any>, skillList, skillTreeName) => {
      skillTreeResult[skillTreeName] = map(skillList, (skill) => {
        const parsedSkill = parseSkill(skill, skillTreeName, characterClass);
        skills.push(parsedSkill);

        if (verbose) {
          console.log(parsedSkill);
        }

        return parsedSkill;
      });

      return skillTreeResult;
    }, {});

    result[characterClass] = parsedSkillTree;

    return result;
  }, {});


  writeFile(skills, version, 'skills');
  writeFile(skillsByClass, version, 'skillsByClass');

  return {
    skills,
    skillsByClass,
  };
}

function parseSkill(skill: Record<string, string>, skillTree: string, characterClass: string): Skill {
  const { name, type, element, description } = skill;
  const uuid = parseInt(skill.id);
  const family = skill.family === 'None' ? undefined : skill.family;
  const minLevel = skill.min_level ? parseInt(skill.min_level) : 0;
  const maxRank = parseInt(skill.max_rank);
  const cooldown = skill.cooldown ? parseInt(skill.cooldown) : undefined;
  const skillRequirement = skill.skill_requirement && skill.skill_requirement !== 'none' ? JSON.parse(skill.skill_requirement) : [];
  const effect = isEmpty(skill.effect) ? [] : skill.effect.split(',');
  const damage = isEmpty(skill.damage) ? [] : skill.damage.split(',');
  const duration = isEmpty(skill.duration) ? [] : skill.duration.split(',').map(str => parseFloat(str));
  const range = isEmpty(skill.range) ? [] : skill.range.split(',').map(str => parseFloat(str));
  const range2 = isEmpty(skill.range2) ? [] : skill.range2.split(',').map(str => parseFloat(str));
  const value = isEmpty(skill.value) ? [] : skill.value.split(',').map(str => parseFloat(str));
  const proc = isEmpty(skill.proc) ? [] : skill.proc.split(',').map(str => parseFloat(str));
  const x = parseInt(skill.x);
  const y = parseInt(skill.y);
  const description_next = isEmpty(skill.description_next) ? undefined : skill.description_next;
  const cost = skill.cost1 ? parseInt(skill.cost1) : undefined;
  const cost100 = skill.cost100 ? parseInt(skill.cost100) : undefined;

  return {
    uuid,
    class: characterClass as CharacterClass,
    tree: skillTree as SkillTree,
    name,
    type: type as SkillType,
    family: family as SkillFamily,
    minLevel,
    maxRank,
    element: element as DamageElement,
    cooldown,
    description,
    description_next,
    cost,
    cost100,
    skillRequirement,
    effect,
    duration,
    x,
    y,
    damage,
    range,
    range2,
    value,
    proc,
  };
}
