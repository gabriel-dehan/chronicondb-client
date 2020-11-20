import React, { FunctionComponent } from 'react';

import Footer from 'components/organisms/Footer/Footer';
import Header from 'components/organisms/Header/Header';

import './Default.scss';

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="p-layout">
      <Header />
      <div className="p-wrapper">
        <div className="p-content">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
