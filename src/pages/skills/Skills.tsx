import React, { FunctionComponent } from 'react';

import SkillsTemplate from 'components/templates/Skills/SkillsTemplate';
import useSeo from 'hooks/useSeo';

const EnchantsPage: FunctionComponent = () => {
  const Seo = useSeo({
    title: 'Skills database',
    description: 'Find the skills that best suit your build.',
  });

  return (
    <>
      <Seo />
      <SkillsTemplate />
    </>
  );
};

export default EnchantsPage;