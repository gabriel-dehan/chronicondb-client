import React, { FunctionComponent } from 'react';

export enum GameIconType {
  Category = 'category',
  Item = 'item',
  Enchant = 'enchant',
}

const BASE_PATH = 'assets/images/game';

const ICONS_PATH: Record<GameIconType, string> = {
  [GameIconType.Category]: `${BASE_PATH}/items/categories/`,
  [GameIconType.Item]: `${BASE_PATH}/items/all/`,
  [GameIconType.Enchant]: `${BASE_PATH}/enchants/`,
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
    src={`${ICONS_PATH[type]}/${name.toLowerCase()}.png`}
    width={width}
    height={height}
    alt={name}
    id={id}
    className={className}
  />
);

export default GameIcon;
