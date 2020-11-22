import React, { FunctionComponent } from 'react';

import { isEmpty } from 'lodash';

import Icon, { IconName } from 'components/atoms/Icon/Icon';

import './Search.scss';

interface SearchProps {
  placeholder?: string;
  value: string;
  onChange: (value?: string) => void;
}

const Search: FunctionComponent<SearchProps> = ({
  placeholder,
  value,
  onChange,
}) => {

  return (
    <div className="a-search">
      <input
        className="a-search__input"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={e => onChange(isEmpty(e.target.value) ? undefined : e.target.value)}
      />
      <Icon
        className="a-search__icon"
        name={IconName.Search}
        width={18}
      />
    </div>
  );
};

export default Search;