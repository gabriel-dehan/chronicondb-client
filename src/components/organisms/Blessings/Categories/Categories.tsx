import React, { FunctionComponent, useState } from 'react';

import Drawer from 'rc-drawer';

import useEngine from 'hooks/useEngine';
import useFilters from 'hooks/useFilters';
import useResponsive from 'hooks/useResponsive';
import { BlessingKind } from 'types/Blessing.types';
import { BlessingsFilters, FiltersType } from 'types/Filters.types';

import './Categories.scss';

const Categories: FunctionComponent = () => {
  const { isUpToTablet } = useResponsive();
  const Engine = useEngine();
  const [filters, setFilters] = useFilters<BlessingsFilters>(FiltersType.Blessings);
  const { Blessings: { kinds, defaultKind } } = Engine;
  const selectedKind = (filters.kind ?? defaultKind) as BlessingKind;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isUpToTablet) {
    return (
      <Drawer
        open={isMobileMenuOpen}
        onHandleClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onClose={() => setIsMobileMenuOpen(false)}
        className="o-blessingKinds__menuMobile"
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
    return (
      <ul className="o-blessingKinds">
        {kinds.map(kind => (
          <li key={`blessing-kind-${kind}`} className={`o-blessingKinds__kind ${selectedKind === kind ? 'selected' : ''}`}>
            <span className="o-blessingKinds__kindName" onClick={() => onSelectKind(kind)}>
              {kind}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  function onSelectKind(kind: BlessingKind) {
    setFilters({ ...filters, kind });
    setIsMobileMenuOpen(false);
  }
};

export default Categories;
