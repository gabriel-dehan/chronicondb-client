import React, { FunctionComponent } from 'react';

import './Header.scss';

// TODO: Refactor with Item and Enchant headers
const Header: FunctionComponent = () => {

  return (
    <div className="m-header">
      <div className="m-header__skills">
        <h3 className="m-header__thead">
          Skill
        </h3>
        <h3  className="m-header__thead reqSkill">
          Req.
        </h3>
      </div>
    </div>
  );

};

export default Header;