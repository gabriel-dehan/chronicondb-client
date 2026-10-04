import React, { FunctionComponent } from 'react';

import Header from 'components/molecules/Items/Header/Header';
import EnchantsPool from 'components/organisms/Items/EnchantsPool/EnchantsPool';
import Item from 'components/organisms/Items/Item/Item';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { Item as ItemInterface } from 'types/Item.types';

import './List.scss';

interface Props {
  items: ItemInterface[];
  showEnchantsPool?: boolean;
}

const List: FunctionComponent<Props> = ({ items, showEnchantsPool = true }) => {
  const currentType = items[0]?.type;
  const { paginatedData, InfiniteScroll } =  useInfiniteScroll<ItemInterface>(items, 10);

  return (
    <div className="o-itemsList">
      {items.length > 0 ? (
        <>
          <Header showEnchantsPool={showEnchantsPool} />
          <div className="o-itemsList__container">
            <div className={`o-itemsList__items ${showEnchantsPool ? '' : 'fullWidth'}`}>
              <InfiniteScroll>
                {paginatedData.map(item => (
                  <Item key={`item-${item.uuid}`} item={item} />
                ))}
              </InfiniteScroll>
            </div>
            {showEnchantsPool && <EnchantsPool itemType={currentType} />}
          </div>
        </>
      ) : (
        <div className="o-itemsList__noItem">
          No item was found matching these criteria.
        </div>
      )}
    </div>
  );
};

export default List;