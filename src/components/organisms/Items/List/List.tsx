import React, { FunctionComponent } from 'react';

import EnchantsPool from 'components/molecules/Items/EnchantsPool/EnchantsPool';
import Header from 'components/molecules/Items/Header/Header';
import Item from 'components/organisms/Items/Item/Item';
import { Item as ItemInterface } from 'types/Item.types';

import './List.scss';

interface Props {
  items: ItemInterface[];
}

const List: FunctionComponent<Props> = ({ items }) => {
  return (
    <div className="o-itemsList">
      {items.length > 0 ? (
        <>
          <Header />
          <div className="o-itemsList__container">
            <div className="o-itemsList__items">
              {items.map(item => (
                <Item key={`item-${item.uuid}`} item={item} />
              ))}
            </div>
            <div className="o-itemsList__possibleEnchants">
              <EnchantsPool type={items[0].type} />
            </div>
          </div>
        </>
      ) : (
        <div className="o-itemsList__noItem">
          No item were found matching these criteria.
        </div>
      )}
    </div>
  );

};

export default List;