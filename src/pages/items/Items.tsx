import React, { FunctionComponent } from 'react';

import ItemsTemplate from 'components/templates/Items/ItemsTemplate';
import useSeo from 'hooks/useSeo';

export const ItemsPage: FunctionComponent = () => {
  const Seo = useSeo({
    title: 'Items database',
    description: 'Find all the items you need to craft your dream build.',
  });

  return (
    <>
      <Seo />
      <ItemsTemplate />
    </>
  );
};

export default ItemsPage;