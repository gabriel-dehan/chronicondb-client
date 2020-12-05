import React, { FunctionComponent } from 'react';

import Drawer from 'rc-drawer';

import EnchantsPool from 'components/molecules/Items/EnchantsPool/EnchantsPool';
import Header from 'components/molecules/Items/Header/Header';
import RunesEnchantsPool from 'components/molecules/Items/RunesEnchantsPool/RunesEnchantsPool';
import Item from 'components/organisms/Items/Item/Item';
import useResponsive from 'hooks/useResponsive';
import { Item as ItemInterface, ItemType } from 'types/Item.types';

import './List.scss';

interface Props {
  items: ItemInterface[];
}

const List: FunctionComponent<Props> = ({ items }) => {
  const { isUpToTablet } = useResponsive();
  const currentType = items[0]?.type;

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
            {renderEnchantsPool()}
          </div>
        </>
      ) : (
        <div className="o-itemsList__noItem">
          No item were found matching these criteria.
        </div>
      )}
    </div>
  );

  function renderEnchantsPool() {
    if (isUpToTablet) {
      return (
        <Drawer
          className={`o-itemsList__enchantsPoolMobile`}
          width="80vw"
          placement={'left'}
        >
          <div className="o-itemsList__possibleEnchants">
            <div className="o-itemsList__title">
            Possible enchants
            </div>
            {currentType === ItemType.Rune ? (
              <RunesEnchantsPool />
            ) : (
              <EnchantsPool type={currentType} />
            )}
          </div>
        </Drawer>
      );
    }

    return (
      <div className="o-itemsList__possibleEnchants">
        {currentType === ItemType.Rune ? (
          <RunesEnchantsPool />
        ) : (
          <EnchantsPool type={currentType} />
        )}
      </div>
    );
  }

};

export default List;