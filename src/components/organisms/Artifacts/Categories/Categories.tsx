import React, { FunctionComponent, useState } from 'react';

import Drawer from 'rc-drawer';

// import useEngine from 'hooks/useEngine';
// import useFilters from 'hooks/useFilters';
import useResponsive from 'hooks/useResponsive';

// import { ArtifactsFilters, FiltersType } from 'types/Filters.types';
import './Categories.scss';
import { allEnumValues } from '../../../../helpers/typeUtils';
import useEngine from '../../../../hooks/useEngine';
import useFilters from '../../../../hooks/useFilters';
import { ArtifactType } from '../../../../types/Artifact.types';
import { ArtifactsFilters, FiltersType } from '../../../../types/Filters.types';
import GameIcon, { GameIconType } from '../../../atoms/GameIcon/GameIcon';


// TODO: Refacto in a sidebar component that can be used for skills, enchants and items
const categories = allEnumValues(ArtifactType);
const Categories: FunctionComponent = () => {
  const { isUpToTablet } = useResponsive();
  const Engine = useEngine();
  const [filters, setFilters] = useFilters<ArtifactsFilters>(FiltersType.Artifacts);

  const { Artifacts: { defaultType } } = Engine;
  const baseType = (filters.type ?? defaultType) as ArtifactType;
  const [selectedType, setSelectedType] = useState<ArtifactType>(baseType);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isUpToTablet) {
    return (
      <Drawer
        open={isMobileMenuOpen}
        onHandleClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onClose={() => setIsMobileMenuOpen(false)}
        className={`o-artifactClasses__menuMobile ${selectedType.toLowerCase()}`}
        width="60vw"
        placement={'left'}
      >
        {renderCategoryMenu()}
      </Drawer>
    );
  } else {
    return renderCategoryMenu();
  }

  function renderCategoryMenu() {
    return <ul className={'o-artifactClasses'}>
      {categories.map((type, index) => {
        const isSelected = selectedType === type;
        return <li key={`skill-class-${index}`} className={`o-artifactClasses__class ${isSelected && 'selected'}`}>
          <span
            className={`o-artifactClasses__className`}
            onClick={() => onSelectedType(type)}
          >
            {type}
            <GameIcon
              className="o-artifactClasses__className-icon"
              type={GameIconType.Artifact}
              name={type.toLowerCase()}
              width={16}
            />
          </span>
        </li>;
      })}
    </ul>;
  }

  function onSelectedType(artifactType: ArtifactType) {
    setSelectedType(artifactType);
    setFilters({ ...filters, type: artifactType });
  }

};

export default Categories;