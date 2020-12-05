import React, { FunctionComponent, useState } from 'react';

import { xor } from 'lodash';

import './Multiselect.scss';

export interface MultiselectOption {
  label: string;
  value: string;
  color: string;
}

export interface MultiselectProps {
  className?: string;
  defaultValues: string[];
  options: MultiselectOption[];
  onChange: (values: string[]) => void;
}

const Multiselect: FunctionComponent<MultiselectProps> = ({
  className,
  defaultValues,
  options,
  onChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValues);

  return (
    <div className={`a-multiselect ${className ? className : ''}`}>
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option.value);
        const optionStyles = isSelected ? {
          color: option.color,
          textShadow: `0px -2px 16px ${option.color}`,
        } : {};
        const borderStyles = isSelected ? {
          backgroundColor: option.color,
          boxShadow: `0 0 12px ${option.color}, 0 1px 6px ${option.color}`,
        } : {};

        return (
          <div
            key={`multiselect-option-${option.value}`}
            className={`a-multiselect__option ${isSelected ? 'selected' : ''}`}
            onClick={() => onClickOption(option)}
            style={optionStyles}
          >
            {option.label}
            <span className="a-multiselect__option-borderBottom" style={borderStyles}></span>
          </div>
        );
      })}
    </div>
  );

  function onClickOption(option: MultiselectOption) {
    const newSelectedOptions = xor(selectedOptions, [option.value]);
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  }
};

export default Multiselect;