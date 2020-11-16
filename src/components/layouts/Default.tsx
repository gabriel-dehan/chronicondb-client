import Header from 'components/organisms/Header/Header';
import React, { FunctionComponent } from 'react';

import './Default.scss';

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="o-layout">
      <Header />
      <div>{children}</div>
      {/* Footer */}
    </div>
  );
};

export default DefaultLayout;
