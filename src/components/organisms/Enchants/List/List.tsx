import React, { FunctionComponent } from 'react';

import Enchant from 'components/organisms/Enchants/Enchant/Enchant';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { Enchant as EnchantInterface } from 'types/Enchant.types';

import './List.scss';

interface Props {
  enchants: EnchantInterface[];
}

// TODO: Header should be a reusable component between lists
const List: FunctionComponent<Props> = ({
  enchants,
}) => {
  const { paginatedData, InfiniteScroll } =  useInfiniteScroll<EnchantInterface>(enchants, 10);

  return (
    <div className="o-enchantsList">
      {enchants.length > 0 ? (
        <>
          <div className="o-enchantsList__header">
            <div className="o-enchantsList__header__items">
              <h3 className="o-enchantsList__header__thead">
                Enchant
              </h3>
              <h3 className="o-enchantsList__header__thead">
                Affixes
              </h3>
            </div>
          </div>
          <div className="o-enchantsList__container">
            <div className="o-enchantsList__enchants">
              <InfiniteScroll>
                {paginatedData.map(enchant => (
                  <Enchant key={`enchant-${enchant.uuid}`} enchant={enchant} />
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </>
      ) : (
        <div className="o-enchantsList__noEnchant">
          No Enchant was found matching these criteria.
        </div>
      )}
    </div>
  );
};

export default List;