import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title: string,
  description: string,
}

const useSeo = ({
  title,
  description,
}: Props) => {

  const SeoTag: FunctionComponent = () => {
    return (
      <Helmet>
        <title>ChroniconDB - {title}</title>
        <meta name="description" content={description} />
      </Helmet>
    );
  };

  return SeoTag;
};

export default useSeo;