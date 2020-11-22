import React, { FunctionComponent, useState, createRef } from 'react';

import Icon, { IconName } from 'components/atoms/Icon/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';

import './Dropdown.scss';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  id?: string;
  className?: string;
  label: string;
  defaultValue?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

const Dropdown: FunctionComponent<DropdownProps> = ({
  id,
  className,
  label,
  defaultValue,
  options,
  onChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentValue, setCurrentValue] = useState(defaultValue || options[0].value);
  const currentValueLabel = options.find(opt => opt.value === currentValue)?.label || defaultValue;
  const dropdownRef = createRef<HTMLDivElement>();

  useOnClickOutside(dropdownRef, onClickOutside);

  return (
    <div
      id={id}
      className={`a-dropdown ${className ? className : ''}`}
      ref={dropdownRef}
    >
      <div className="a-dropdown__container">
        <div
          className="a-dropdown__trigger"
          onClick={toggleDropdown}
        >
          <span className="a-dropdown__trigger-label">{label}</span>
          <span className="a-dropdown__trigger-value">{currentValueLabel}</span>
          <div className="a-dropdown__icon"><Icon name={IconName.ArrowDownBlue} width={16} height={8} /></div>
        </div>
        <div className={`a-dropdown__options ${showDropdown ? 'open' : ''}`}>
          {options.map(({ value, label }, index) => (
            <span
              key={`dropdown-${value}-${index}`}
              className={`a-dropdown__option ${value === currentValue ? 'selected' : ''}`}
              data-value={value}
              onClick={() => onSelect(value)}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  function onSelect(value: string) {
    setCurrentValue(value);
    setShowDropdown(false);
    onChange(value);
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  function onClickOutside() {
    if (showDropdown) {
      setShowDropdown(false);
    }
  }
};

export default Dropdown;