import React, { FunctionComponent } from 'react';

import Drawer from 'rc-drawer';

import ItemsEnchantsPool from 'components/molecules/Items/ItemsEnchantsPool/ItemsEnchantsPool';
import RunesEnchantsPool from 'components/molecules/Items/RunesEnchantsPool/RunesEnchantsPool';
import useResponsive from 'hooks/useResponsive';
import { ItemType } from 'types/Item.types';

import './EnchantsPool.scss';

interface Props {
  itemType: ItemType;
}

const EnchantsPool: FunctionComponent<Props> = ({
  itemType,
}) => {
  const { isUpToTablet } = useResponsive();

  if (isUpToTablet) {
    return (
      <Drawer
        className={`o-enchantsPool__enchantsPoolMobile`}
        width="80vw"
        placement={'left'}
      >
        <div className="o-enchantsPool__possibleEnchants">
          <div className="o-enchantsPool__title">
            Possible enchants
          </div>
          {itemType === ItemType.Rune ? (
            <RunesEnchantsPool />
          ) : (
            <ItemsEnchantsPool type={itemType} />
          )}
        </div>
      </Drawer>
    );
  }

  return (
    <div className="o-enchantsPool__possibleEnchants">
      {itemType === ItemType.Rune ? (
        <RunesEnchantsPool />
      ) : (
        <ItemsEnchantsPool type={itemType} />
      )}
    </div>
  );
};

export default EnchantsPool;