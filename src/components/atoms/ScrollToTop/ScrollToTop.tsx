import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop: React.FunctionComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
