import React, { FunctionComponent } from 'react';

import { Curse as CurseInterface } from 'types/Blessing.types';

import { renderSlot, renderValue } from '../Blessing/Blessing';
import '../Blessing/Blessing.scss';

interface Props {
  curse: CurseInterface;
}

const Curse: FunctionComponent<Props> = ({ curse }) => {
  return (
    <div className="o-blessing">
      <div className="o-blessing__header">
        <h2 className="o-blessing__name">{curse.name}</h2>
        <div className="o-blessing__meta">
          {curse.slots.map(slot => renderSlot(
            slot,
            `curse-${curse.uuid}-slot-${slot}`,
            curse.shieldOnly ? 'Shield' : slot,
          ))}
        </div>
      </div>
      <div className="o-blessing__content">
        <div className="o-blessing__description">
          {renderValue(curse.description, /(NUM)/, curse.value, `curse-${curse.uuid}`)}
        </div>
        <div className="o-blessing__note">
          To purify: {renderValue(curse.purifyAction, /(MAX)/, curse.purifyRequired, `curse-${curse.uuid}-purify`)}
        </div>
      </div>
    </div>
  );
};

export default Curse;
