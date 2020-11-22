import React, { FunctionComponent } from 'react';

import Categories from 'components/organisms/Items/Categories/Categories';
import Filters from 'components/organisms/Items/Filters/Filters';
import List from 'components/organisms/Items/List/List';

import './Items.scss';

const Items: FunctionComponent = () => {
  return (
    <>
      <Filters />
      <div className="t-items__wrapper">
        <Categories />
        <div className="t-items__list">
          <List />
        </div>
      </div>
    </>
  );
};

export default Items;