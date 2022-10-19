import React, { FunctionComponent } from 'react';

import useSeo from 'hooks/useSeo';

import ArtifactsTemplate from '../../components/templates/Artifacts/ArtifactsTemplate';

const EnchantsPage: FunctionComponent = () => {
  const Seo = useSeo({
    title: 'Artifacts database',
    description: 'Find the Artifacts that best suit your build.',
  });

  return (
    <>
      <Seo />
      <ArtifactsTemplate />
    </>
  );
};

export default EnchantsPage;