import React, { FunctionComponent, useState } from 'react';

import './CheckboxSelect.scss';

export interface CheckboxSelectProps {
  className?: string;
  selected: boolean;
  label: string;
  value: string;
  color: string;
  onChange: (selected: boolean) => void;
}

const CheckboxSelect: FunctionComponent<CheckboxSelectProps> = ({
  className,
  selected,
  label,
  value,
  color,
  onChange,
}) => {
  const [isSelected, setIsSelected] = useState(selected);
  const optionStyles = isSelected ? {
    color: color,
    textShadow: `0px -2px 16px ${color}`,
  } : {};
  const borderStyles = isSelected ? {
    backgroundColor: color,
    boxShadow: `0 0 12px ${color}, 0 1px 6px ${color}`,
  } : {};

  return (
    <div className={`a-checkboxSelect ${className ? className : ''}`}>
      <div
        key={`checkboxSelect-label-${value}`}
        className={`a-checkboxSelect__label ${isSelected ? 'selected' : ''}`}
        onClick={onClickOption}
        style={optionStyles}
      >
        {label}
        <span className="a-checkboxSelect-borderBottom" style={borderStyles}></span>
      </div>
    </div>
  );

  function onClickOption() {
    setIsSelected(!isSelected);
    onChange(!isSelected);
  }
};

export default CheckboxSelect;