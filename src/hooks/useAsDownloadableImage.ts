import { useState, useEffect, RefObject, CSSProperties } from 'react';

import { saveAs } from 'file-saver';
import { toBlob } from 'html-to-image';

export default function useAsDownloadableImage(node: RefObject<HTMLElement>, style: CSSProperties): (name: string, callback?: () => void) => void {
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    if (node.current) {
      // @ts-ignore
      toBlob(node.current, { pixelRatio: 1, style })
        .then((blob) => {
          if (blob) {
            setBlob(blob);
          }
        });
    }
  }, [node, style]);

  return (name: string, callback?: () => void) => {
    if (blob) {
      saveAs(blob, `${name}.png`);
      callback && callback();
    }
  };
}
