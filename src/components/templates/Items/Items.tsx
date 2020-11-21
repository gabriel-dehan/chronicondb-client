import React, { FunctionComponent } from 'react';

import Header from 'components/molecules/Items/Header/Header';
import Categories from 'components/organisms/Items/Categories/Categories';
import Filters from 'components/organisms/Items/Filters/Filters';
import List from 'components/organisms/Items/List/List';

const Items: FunctionComponent = () => {
  return (
    <>
      <Filters />
      <Categories />
      <Header />
      <List />
    </>
  );
};

export default Items;