import { compact, findKey, uniq } from 'lodash';

import { allEnumValues } from '../../helpers/typeUtils';
import { ArtifactInterface } from '../../types/Artifact.types';
import { Enchant } from '../../types/Enchant.types';
import { Item, ItemSet, ItemType, ItemCategory } from '../../types/Item.types';
import { Skill } from '../../types/Skill.types';
import { ITEM_TYPES_BY_CATEGORIES } from '../data/dataMappings';
import { readExtractFile, writeFile } from '../utils/fileUtils';
import {compare} from "compare-versions";

interface Data {
  items: Item[];
  sets: ItemSet[];
  enchants: Enchant[];
  skills: Skill[];
  artifacts: ArtifactInterface[];
}

export function generateSearchIndexes(version: string) {
  const items = JSON.parse(readExtractFile(version, 'items')) as Item[];
  const sets = JSON.parse(readExtractFile(version, 'sets')) as ItemSet[];
  const enchants = JSON.parse(readExtractFile(version, 'enchants')) as Enchant[];
  const skills = JSON.parse(readExtractFile(version, 'skills')) as Skill[];
  let artifacts = [] as ArtifactInterface[];
  if (compare(version, '1.40.1', '>=')) {
    artifacts = JSON.parse(readExtractFile(version, 'artifacts')) as ArtifactInterface[];
  }
  const data: Data = { items, sets, enchants, skills, artifacts };

  generateItemsSearchIndex(version, data);
  generateEnchantsSearchIndex(version, data);
  generateSkillsSearchIndex(version, data);
  if (compare(version, '1.40.1', '>=')) {
    generateArtifactsSearchIndex(version, data);
  }
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

  //@ts-ignore
  const categoriesByType: Record<ItemType, ItemCategory> = allEnumValues(ItemType)
    .reduce((memo: Record<ItemType, ItemCategory>, type) => {
      memo[type] = findKey(ITEM_TYPES_BY_CATEGORIES, types =>
        types.includes(type)
      ) as ItemCategory;

      return memo;
    }, {});

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
      itemTypes: uniq(enchant.itemTypes).join(', '),
      itemCategories: uniq(enchant.itemTypes.map(itemType => categoriesByType[itemType])).join(', '),
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

function generateArtifactsSearchIndex(version: string, data: Data) {
  const index: Record<string, string | number>[] = [];

  const { artifacts } = data;

  artifacts.forEach((artifacts) => {
    const indexedArtifact: Record<string, string | number> = {
      uuid: artifacts.uuid,
      class: artifacts.class,
      name: artifacts.name,
      type: artifacts.type || '',
      description: artifacts.description
        .replace(/\+?PROC%?/g, '')
        .replace(/\+?DAMAGE%?/g, '')
        .replace(/\+?DURATION%?/g, '')
        .replace(/\+?EFFECT%?/g, '')
        .replace(/\+?VALUE%?/g, ''),
    };

    index.push(indexedArtifact);
  });

  writeFile(index, version, 'artifactsSearchIndex');
}