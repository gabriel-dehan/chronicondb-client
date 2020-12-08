import React, { FunctionComponent } from 'react';

import EnchantsTemplate from 'components/templates/Enchants/EnchantsTemplate';
import useSeo from 'hooks/useSeo';

const EnchantsPage: FunctionComponent = () => {
  const Seo = useSeo({
    title: 'Enchants database',
    description: 'Find all the enchants you need to craft your dream items.',
  });

  return (
    <>
      <Seo />
      <EnchantsTemplate />
    </>
  );
};

export default EnchantsPage;