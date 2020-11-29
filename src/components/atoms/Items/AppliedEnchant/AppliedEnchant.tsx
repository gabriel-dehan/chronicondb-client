import React, { FunctionComponent } from 'react';
import replaceWithJSX from 'react-string-replace';

import { SimpleEnchant } from 'types/Enchant.types';

import './AppliedEnchant.scss';

interface Props {
  enchant: SimpleEnchant;
}

const AppliedEnchant: FunctionComponent<Props> = ({
  enchant,
}) => {
  return (
    <li className="a-appliedEnchant">
      {descriptionToTemplate()}
    </li>
  );

  function descriptionToTemplate() {
    return replaceWithJSX(enchant.description, /(AMOUNT)/, (_, i) => {
      return (
        <span
          key={`tpl-enchant-${enchant.name}-${i}`}
          className="a-appliedEnchant__range"
        >
          {renderRange()}
        </span>
      );
    });
  }

  function renderRange() {
    if (enchant.min === enchant.max) {
      return (
        <em className="a-appliedEnchant__max">{enchant.max}</em>
      );
    } else {
      return (
        <>
          [<em className="a-appliedEnchant__min">{enchant.min}</em>-<em className="a-appliedEnchant__max">{enchant.max}</em>]
        </>
      );
    }
  }
};

export default AppliedEnchant;