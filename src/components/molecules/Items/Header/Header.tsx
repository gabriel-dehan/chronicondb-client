import React, { FunctionComponent } from 'react';

import './Header.scss';

const Header: FunctionComponent = () => {
  return (
    <div className="m-header">
      <div className="m-header__items">
        <h3 className="m-header__thead">Item</h3>
        <h3 className="m-header__thead req">Req.</h3>
      </div>
      <div className="m-header__enchants">
        <h3 className="m-header__thead">Possible Enchants</h3>
      </div>

    </div>
  );
};

export default Header;