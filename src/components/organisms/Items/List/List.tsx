import React, { FunctionComponent, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { chunk } from 'lodash';

import Header from 'components/molecules/Items/Header/Header';
import EnchantsPool from 'components/organisms/Items/EnchantsPool/EnchantsPool';
import Item from 'components/organisms/Items/Item/Item';
import { Item as ItemInterface } from 'types/Item.types';

import './List.scss';

interface Props {
  items: ItemInterface[];
}

const List: FunctionComponent<Props> = ({ items }) => {
  const currentType = items[0]?.type;
  const perPage = 10;
  const [itemsChunks, setItemsChunks] = useState<ItemInterface[][]>(chunk(items, perPage));
  const [paginatedItems, setPaginatedItems] = useState<ItemInterface[]>(itemsChunks[0]);

  useEffect(() => {
    const chunks = chunk(items, perPage);
    setItemsChunks(chunks);
    setPaginatedItems(chunks[0]);
  }, [items]);

  return (
    <div className="o-itemsList">
      {items.length > 0 ? (
        <>
          <Header />
          <div className="o-itemsList__container">
            <div className="o-itemsList__items">
              <InfiniteScroll
                dataLength={paginatedItems.length}
                next={fetchNextItems}
                hasMore={paginatedItems.length < items.length}
                loader={<h4>Loading...</h4>}
              >
                {paginatedItems.map(item => (
                  <Item key={`item-${item.uuid}`} item={item} />
                ))}
              </InfiniteScroll>
            </div>
            <EnchantsPool itemType={currentType} />
          </div>
        </>
      ) : (
        <div className="o-itemsList__noItem">
          No item was found matching these criteria.
        </div>
      )}
    </div>
  );

  function fetchNextItems() {
    const currentChunk = Math.round(paginatedItems.length / perPage) - 1;
    setPaginatedItems([...paginatedItems, ...itemsChunks[currentChunk + 1]]);
  }
};

export default List;