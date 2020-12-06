import React from 'react';

import './Badge.scss';

interface Props {
  label: string;
  color: string;
}

const Badge: React.FunctionComponent<Props> = ({
  label,
  color,
}) => {
  return (
    <em className="a-badge" style={{ backgroundColor: color }}>
      {label}
    </em>
  );
};

export default Badge;
