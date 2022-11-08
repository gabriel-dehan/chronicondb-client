import React, { FunctionComponent } from 'react';
import replaceWithJSX from 'react-string-replace';
import { Tooltip } from 'react-tippy';

import { camelCase } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';

import './Artifact.scss';

import useResponsive from '../../../../hooks/useResponsive';
import { ArtifactInterface } from '../../../../types/Artifact.types';
import { CharacterClass } from '../../../../types/Character.types';
import Badge from '../../../atoms/Badge/Badge';

interface Props {
  artifact: ArtifactInterface,
}

const Artifact: FunctionComponent<Props> = ({
  artifact,
}) => {
  const { isUpToTablet } = useResponsive();
  return (
    <div className="o-artifact">
      <div className="o-artifact__header">
        <div className="o-artifact__header-content">
          <span className="o-artifact__icon" >
            <GameIcon type={GameIconType.Artifact} name={artifact.type || ''} width={16} />
          </span>
          <div className="o-artifact__header-title">
            <h2 className="o-artifact__header-name">
              {artifact.name}
            </h2>
          </div>
        </div>
        <div className="o-artifact__header-meta">
          <span className="o-artifact__header-meta-category">
            <span className="o-artifact__header-meta-class">
              {renderBadges(artifact.class)}
            </span>
          </span>
        </div>
      </div>
      <div className="o-artifact__content">
        <div className="o-artifact__content-main">
          <div className="o-artifact__description">
            {renderDescription()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderDescription() {
    let replacementCounter = 0; // Fuck react unique keys
    return replaceWithJSX(artifact.description, /(AMOUNT)/, (match, i, offset) => {
      replacementCounter++;
      return <span key={`amount-${i}-${offset}-${replacementCounter}`} style={{ color: 'var(--color-element-light-green)' }}>{artifact.value}</span>;
    });
  }

  function renderBadges(classRestriction: CharacterClass | 'Any Class') {
    // Mobile has less space
    if (isUpToTablet) {
      return (
        <Badge
          label={classRestriction}
          color={`var(--color-class-${camelCase(classRestriction)})`}
        />
      );
    }

    if (classRestriction === 'Any Class') {
      return (
        <Tooltip
          title={classRestriction}
          position="bottom"
          arrow={true}
          distance={5}
          offset={0}
          size="small"
        >
          {[CharacterClass.Templar, CharacterClass.Berserker, CharacterClass.Warlock, CharacterClass.Warden].map(charClass => (
            <GameIcon
              key={`item-${artifact.uuid}-req-class-${charClass.toLowerCase()}`}
              type={GameIconType.ClassProfile}
              name={charClass.toLowerCase()}
              height={28}
            />
          ))}
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          title={classRestriction}
          position="bottom"
          arrow={true}
          distance={5}
          offset={0}
          size="small"
        >
          <GameIcon
            type={GameIconType.ClassProfile}
            name={classRestriction.toLowerCase()}
            height={28}
          />
        </Tooltip>
      );
    }
  }
};

export default Artifact;