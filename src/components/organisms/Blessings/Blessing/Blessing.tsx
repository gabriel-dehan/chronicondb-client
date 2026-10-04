import React, { FunctionComponent } from 'react';
import replaceWithJSX from 'react-string-replace';
import { Tooltip } from 'react-tippy';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import { Blessing as BlessingInterface, BlessingSlot } from 'types/Blessing.types';

import './Blessing.scss';

interface Props {
  blessing: BlessingInterface;
}

const ANY_CLASS_COUNT = 5;

export function slotIconName(slot: BlessingSlot): string {
  return slot === BlessingSlot.Helm ? 'helmet' : slot.toLowerCase();
}

export function renderSlot(slot: BlessingSlot, key: string, label = slot as string) {
  return (
    <Tooltip key={key} title={label} position="bottom" arrow={true} distance={5} offset={0} size="small">
      <span className="o-blessing__slot">
        <GameIcon type={GameIconType.ItemCategory} name={slotIconName(slot)} width={20} />
        {label}
      </span>
    </Tooltip>
  );
}

export function renderValue(description: string, placeholder: RegExp, value: number | undefined, key: string) {
  let replacementCounter = 0;
  return replaceWithJSX(description, placeholder, (match, i, offset) => {
    replacementCounter++;
    return (
      <span key={`${key}-${i}-${offset}-${replacementCounter}`} className="o-blessing__value">
        {value}
      </span>
    );
  });
}

const Blessing: FunctionComponent<Props> = ({ blessing }) => {
  return (
    <div className="o-blessing">
      <div className="o-blessing__header">
        <h2 className="o-blessing__name">{blessing.name}</h2>
        <div className="o-blessing__meta">
          {blessing.slot && renderSlot(blessing.slot, `blessing-${blessing.uuid}-slot`)}
          {renderClasses()}
        </div>
      </div>
      <div className="o-blessing__content">
        <div className="o-blessing__description">
          {renderValue(blessing.description, /(AMOUNT)/, blessing.value, `blessing-${blessing.uuid}`)}
        </div>
      </div>
    </div>
  );

  function renderClasses() {
    if (blessing.classes.length === 0) {
      return null;
    }

    const title = blessing.classes.length === ANY_CLASS_COUNT ? 'Any Class' : blessing.classes.join(', ');

    return (
      <Tooltip title={title} position="bottom" arrow={true} distance={5} offset={0} size="small">
        <span className="o-blessing__classes">
          {blessing.classes.map(charClass => (
            <GameIcon
              key={`blessing-${blessing.uuid}-class-${charClass.toLowerCase()}`}
              type={GameIconType.ClassProfile}
              name={charClass.toLowerCase()}
              height={28}
            />
          ))}
        </span>
      </Tooltip>
    );
  }
};

export default Blessing;
