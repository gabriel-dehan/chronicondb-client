import React, { FunctionComponent } from 'react';

import './Header.scss';

const Header: FunctionComponent = () => {
  return (
    <header className="o-header">
      <h1 className="o-header__logo">ChroniconDB</h1>
    </header>
  );
};

export default Header;
