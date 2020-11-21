/* eslint-disable react/prefer-stateless-function */
import React, { createRef, FunctionComponent } from 'react';

import Footer from 'components/organisms/Footer/Footer';
import useAsDownloadableImage from 'hooks/useAsDownloadableImage';

const ItemImage: FunctionComponent = () => {
  const elementRef = createRef<HTMLDivElement>();
  const download = useAsDownloadableImage(elementRef, { height: '100%', opacity: '1' });

  return (
    <div>
      <button onClick={() => download('test')}>Download</button>
      <div ref={elementRef} style={{ height: '0', opacity: '0' }}>
        <Footer />
      </div>
    </div>
  );
};

export default ItemImage;