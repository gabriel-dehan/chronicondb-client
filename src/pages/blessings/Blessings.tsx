import React, { FunctionComponent } from 'react';

import BlessingsTemplate from 'components/templates/Blessings/BlessingsTemplate';
import useSeo from 'hooks/useSeo';

const BlessingsPage: FunctionComponent = () => {
  const Seo = useSeo({
    title: 'Blessings & Curses database',
    description: 'Find which Blessings and Curses can roll on each item slot.',
  });

  return (
    <>
      <Seo />
      <BlessingsTemplate />
    </>
  );
};

export default BlessingsPage;
