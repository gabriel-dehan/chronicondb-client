import React, { FunctionComponent } from 'react';

import Header from 'components/molecules/Items/Header/Header';

import './List.scss';

const List: FunctionComponent = () => {
  return (
    <div className="o-itemsList">
      <Header />
      <div className="o-itemsList__items">

      </div>
    </div>
  );
};

export default List;