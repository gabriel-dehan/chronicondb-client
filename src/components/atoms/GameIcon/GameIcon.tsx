import React, { FunctionComponent } from 'react';

export enum GameIconType {
  ItemCategory = 'itemCategory',
  Item = 'item',
  EnchantType = 'enchantType',
  Enchant = 'enchant',
  SkillSpell = 'skillSpell',
  SkillMastery = 'skillMastery',
  SkillTree =  'skillTree',
  ClassProfile =  'classProfile',
  ClassHeader =  'classHeader',
  ClassBanner =  'classBanner'
}

const BASE_PATH = 'assets/images/game';

const ICONS_PATH: Record<GameIconType, string> = {
  [GameIconType.ItemCategory]: `${BASE_PATH}/items/categories/`,
  [GameIconType.Item]: `${BASE_PATH}/items/all/`,
  [GameIconType.EnchantType]: `${BASE_PATH}/enchants/types/`,
  [GameIconType.Enchant]: `${BASE_PATH}/enchants/`,
  [GameIconType.SkillSpell]: `${BASE_PATH}/skills/skills/`,
  [GameIconType.SkillMastery]: `${BASE_PATH}/skills/masteries/`,
  [GameIconType.SkillTree]: `${BASE_PATH}/skills/trees/`,
  [GameIconType.ClassProfile]: `${BASE_PATH}/classes/profiles/`,
  [GameIconType.ClassHeader]: `${BASE_PATH}/classes/headers/`,
  [GameIconType.ClassBanner]: `${BASE_PATH}/classes/banners/`,
};

export interface Props {
  id?: string;
  className?: string;
  type: GameIconType;
  name: string;
  width?: number;
  height?: number;
}

const GameIcon: FunctionComponent<Props> = ({
  id,
  className,
  type,
  name,
  width,
  height,
}) =>  (
  <img
    aria-label={name}
    src={`/${ICONS_PATH[type]}/${name.toLowerCase()}.png`}
    width={width}
    height={height}
    alt={name}
    id={id}
    className={className}
  />
);

export default GameIcon;
