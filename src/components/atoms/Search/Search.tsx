import React, { FunctionComponent, useState, useCallback } from 'react';

import { isEmpty, debounce } from 'lodash';

import Icon, { IconName } from 'components/atoms/Icon/Icon';

import './Search.scss';

interface SearchProps {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (value?: string) => void;
}

const Search: FunctionComponent<SearchProps> = ({
  className,
  placeholder,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const onDebouncedChange = useCallback(debounce((val) => {
    onChange(isEmpty(val) ? undefined : val);
  }, 500), []);

  return (
    <div className={`a-search ${className ? className : ''}`}>
      <input
        className="a-search__input"
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onChange={onInputChange}
      />
      <div className="a-search__iconContainer">
        <Icon
          className="a-search__icon"
          name={IconName.Search}
          width={18}
        />
      </div>
    </div>
  );

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    onDebouncedChange(e.target.value);
  }
};

export default Search;