import React, { FunctionComponent } from 'react';

export enum IconName {
  ArrowDownBlue = 'arrow_down_blue',
  ArrowDownPurple = 'arrow_down_purple',
  ArrowDownYellow = 'arrow_down_yellow',
  ArrowDownWhite = 'arrow_down_white',
  ArrowRightBlue = 'arrow_right_blue',
  ArrowRightPurple = 'arrow_right_purple',
  ArrowRightYellow = 'arrow_right_yellow',
  ArrowRightWhite = 'arrow_right_white',
  ArrowUpBlue = 'arrow_up_blue',
  Copy = 'copy',
  Link = 'link',
  Search = 'search',
  Menu = 'menu'
}

const SVG_PATH = 'assets/images/icons';

export interface Props {
  id?: string;
  className?: string;
  name: IconName;
  width?: number;
  height?: number;
}

const Icon: FunctionComponent<Props> = ({
  id,
  className,
  name,
  width,
  height,
}) =>  (
  <img
    aria-label={name}
    src={`${SVG_PATH}/${name}.svg`}
    width={width}
    height={height}
    alt={name}
    id={id}
    className={className}
  />
);

export default Icon;
