import React, { FunctionComponent } from 'react';

import Enchant from 'components/organisms/Enchants/Enchant/Enchant';
import { Enchant as EnchantInterface } from 'types/Enchant.types';

import './List.scss';

interface Props {
  enchants: EnchantInterface[];
}

const List: FunctionComponent<Props> = ({
  enchants,
}) => {

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
              {enchants.map(enchant => (
                <Enchant key={`enchant-${enchant.uuid}`} enchant={enchant} />
              ))}
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