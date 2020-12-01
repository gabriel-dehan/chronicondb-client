import { compact } from 'lodash';

import { Enchant } from '../../types/Enchant.types';
import { Item, ItemSet } from '../../types/Item.types';
import { Skill } from '../../types/Skill.types';
import { readExtractFile, writeFile } from '../utils/fileUtils';

interface Data {
  items: Item[];
  sets: ItemSet[];
  enchants: Enchant[];
  skills: Skill[];
}

export function generateSearchIndexes(version: string) {
  const items = JSON.parse(readExtractFile(version, 'items')) as Item[];
  const sets = JSON.parse(readExtractFile(version, 'sets')) as ItemSet[];
  const enchants = JSON.parse(readExtractFile(version, 'enchants')) as Enchant[];
  const skills = JSON.parse(readExtractFile(version, 'skills')) as Skill[];
  const data: Data = { items, sets, enchants, skills };

  generateItemsSearchIndex(version, data);
  generateEnchantsSearchIndex(version, data);
  generateSkillsSearchIndex(version, data);
}

function generateItemsSearchIndex(version: string, data: Data) {
  const index: Record<string, string | number>[] = [];
  const { items, enchants, sets, skills } = data;

  items.forEach((item) => {
    const indexedItem: Record<string, string | number> = {
      uuid: item.uuid,
      name: item.name,
      type: item.type,
      category: item.category,
      description: item.description || '',
      classRestriction: item.classRestriction || '',
    };

    const fixedEnchants = compact(item.fixedEnchants.map(fe => enchants.find(e => e.uuid === fe)));
    const setData = sets.find(s => s.uuid === item.set);

    indexedItem.enchants = fixedEnchants
      .map(fe => fe.description)
      .join('\n')
      .replace(/\+?AMOUNT%?/g, '')
      .replace(/<SKILL_(\d+)>/g, (_, p1) => {
        const skill = skills.find(s => s.uuid === parseInt(p1));
        return skill ? skill.name : 'Unknown Skill';
      })
      .trim();
    indexedItem.setName = setData ? setData.name : '';
    indexedItem.setBonuses = setData ? Object.values(setData.bonuses).join('\n') : '';

    index.push(indexedItem);
  });

  writeFile(index, version, 'itemsSearchIndex');
}

function generateEnchantsSearchIndex(version: string, data: Data) {
  const index: Record<string, string | number>[] = [];
  const { enchants, skills } = data;

  enchants.forEach((enchant) => {
    const indexedEnchant: Record<string, string | number> = {
      uuid: enchant.uuid,
      name: enchant.name,
      category: enchant.category,
      description: enchant.description ?
        enchant.description
          .replace(/\+?AMOUNT%?/g, '')
          .replace(/<SKILL_(\d+)>/g, (_, p1) => {
            const skill = skills.find(s => s.uuid === parseInt(p1));
            return skill ? skill.name : 'Unknown Skill';
          })
        : '',
    };

    index.push(indexedEnchant);
  });

  writeFile(index, version, 'enchantsSearchIndex');
}

function generateSkillsSearchIndex(version: string, data: Data) {
  const index: Record<string, string | number>[] = [];

  const { skills } = data;

  skills.forEach((skill) => {
    const indexedSkill: Record<string, string | number> = {
      uuid: skill.uuid,
      class: skill.class,
      name: skill.name,
      tree: skill.tree,
      type: skill.type || '',
      element: skill.element,
      family: skill.family || '',
      description: skill.description
        .replace(/\+?PROC%?/g, '')
        .replace(/\+?DAMAGE%?/g, '')
        .replace(/\+?DURATION%?/g, '')
        .replace(/\+?EFFECT%?/g, '')
        .replace(/\+?VALUE%?/g, ''),
    };

    index.push(indexedSkill);
  });

  writeFile(index, version, 'skillsSearchIndex');
}