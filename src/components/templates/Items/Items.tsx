import React, { FunctionComponent } from 'react';

import Header from 'components/molecules/Items/Header/Header';
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
          <Header />
          <List />
        </div>
      </div>
    </>
  );
};

export default Items;