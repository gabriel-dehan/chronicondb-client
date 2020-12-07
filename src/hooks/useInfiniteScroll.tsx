import React, { FunctionComponent, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { chunk } from 'lodash';

export default function useInfiniteScroll<T>(data: T[], perPage = 10) {
  const [dataChunks, setDataChunks] = useState<T[][]>(chunk(data, perPage));
  const [paginatedData, setPaginatedData] = useState<T[]>(dataChunks[0]);

  useEffect(() => {
    const chunks = chunk(data, perPage);
    setDataChunks(chunks);
    setPaginatedData(chunks[0]);
  }, [data, perPage]);

  return {
    paginatedData,
    InfiniteScroll: getTag(),
  };

  function getTag() {
    const InfiniteScroller: FunctionComponent = ({ children }) => {
      return (
        <InfiniteScroll
          dataLength={paginatedData.length}
          next={fetchNextData}
          hasMore={paginatedData.length < data.length}
          loader={<h4>Loading...</h4>}
        >
          {children}
        </InfiniteScroll>
      );
    };
    return InfiniteScroller;
  }

  function fetchNextData() {
    const currentChunk = Math.ceil(paginatedData.length / perPage) - 1;
    setPaginatedData([...paginatedData, ...dataChunks[currentChunk + 1]]);
  }
}
