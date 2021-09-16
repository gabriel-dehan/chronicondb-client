import React, { FunctionComponent } from 'react';
import './SortSelect.scss';

interface Props {
  currentOrder: 'asc' | 'desc' | null;
  label: string;
  onChange: () => void;
}

const SortSelect: FunctionComponent<Props> = ({
  currentOrder,
  label,
  onChange,
}) => {
  return (
    <span className="a-sortSelect" onClick={onChange}>
      {label}
      <span className="a-sortSelect__icon">
        <span className={`a-sortSelect__icon-up ${currentOrder === 'asc' ? 'selected' : ''}`}></span>
        <span className={`a-sortSelect__icon-down ${currentOrder === 'desc' ? 'selected' : ''}`}></span>
      </span>
    </span>
  );
};

export default SortSelect;