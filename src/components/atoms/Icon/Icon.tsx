import React, { FunctionComponent } from 'react';

export enum IconName {
  ArrowDownBlue = 'arrow_down_blue',
  ArrowDownPurple = 'arrow_down_purple',
  ArrowDownYellow = 'arrow_down_yellow',
  ArrowRightBlue = 'arrow_right_blue',
  ArrowRightPurple = 'arrow_right_purple',
  ArrowRightYellow = 'arrow_right_yellow',
  ArrowUpBlue = 'arrow_up_blue',
  Copy = 'copy',
  Link = 'link',
  Search = 'search'
}

const SVG_PATH = 'assets/images/icons';

export interface Props {
  id?: string;
  className?: string;
  name: IconName;
  width: number;
  height: number;
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
