import React, { createRef, FunctionComponent, useState, useEffect } from 'react';

import useAsDownloadableImage from 'hooks/useAsDownloadableImage';
import { Item } from 'types/Item.types';

import DownloadableItem from './DownloadableItem/DownloadableItem';

import './ItemDownloader.scss';

const ItemDownloader: FunctionComponent<{ item: Item }> = ({
  item,
}) => {
  const elementRef = createRef<HTMLDivElement>();
  const [renderItem, setRenderItem] = useState(false);
  const download = useAsDownloadableImage(elementRef, { height: 'auto', opacity: '1', width: 'auto' });

  useEffect(() => {
    if (renderItem) {
      download('test', () => {
        setRenderItem(false);
      });
    }
  });

  return (
    <span className="o-itemDownloader" title="Download as an image">
      {renderItem ? (
        <span className="o-itemDownloader__icon">
          <svg style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="-5 0 50 35" stroke="#dc9d63">
            <g fill="none" fillRule="evenodd">
              <g transform="translate(1 1)" strokeWidth="8">
                <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                </path>
              </g>
            </g>
          </svg>
        </span>
      ) : (
        <span  className="o-itemDownloader__icon" onClick={() => setRenderItem(true)}>
          <svg style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" width="18" height="18">
            <g>
              <path fill="#DECFB0" d="M412.907,214.08C398.4,140.693,333.653,85.333,256,85.333c-61.653,0-115.093,34.987-141.867,86.08    C50.027,178.347,0,232.64,0,298.667c0,70.72,57.28,128,128,128h277.333C464.213,426.667,512,378.88,512,320    C512,263.68,468.16,218.027,412.907,214.08z M256,384L149.333,277.333h64V192h85.333v85.333h64L256,384z"/>
            </g>
          </svg>
        </span>
      )}

      {renderItem && (
        <div ref={elementRef} style={{ height: '0', opacity: '0', width: '0' }}>
          <DownloadableItem item={item} />
        </div>
      )}
    </span>
  );
};

export default ItemDownloader;