import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Icon, { IconName } from 'components/atoms/Icon/Icon';
import EnchantsPool from 'components/organisms/Items/EnchantsPool/EnchantsPool';
import Item from 'components/organisms/Items/Item/Item';
import useEngine from 'hooks/useEngine';
import { RoutePath } from 'routes';

import './ItemTemplate.scss';

const ItemTemplate: FunctionComponent = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const Engine = useEngine();
  const item = Engine.Items.find(parseInt(uuid));

  return (
    <>
      <div className="t-item">
        {item ? (
          <>
            <div className="t-item__header">
              <Link to={RoutePath.Items}>
                <Icon
                  className="t-item__header-icon"
                  width={7}
                  height={14}
                  name={IconName.ArrowRightWhite}
                /> Back to items
              </Link>
            </div>
            <div className="t-item__container">
              <Item item={item} setCollapsed={false} />
              <EnchantsPool itemType={item.type} />
            </div>
          </>
        ) : (
          <div className="t-item__notFound">
            Item Not Found
          </div>
        )}
      </div>
    </>
  );
};

export default ItemTemplate;