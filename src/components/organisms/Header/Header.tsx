

import React, { FunctionComponent, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react';
import Drawer from 'rc-drawer';

import Dropdown from 'components/atoms/Dropdown/Dropdown';
import Icon, { IconName } from 'components/atoms/Icon/Icon';
import patches from 'engine/data/patches.json';
import useFilters from 'hooks/useFilters';
import useResponsive from 'hooks/useResponsive';
import { RouteId, RoutePath, ROUTES_ID_MAPPING } from 'routes';
import { GeneralFilters, FiltersType } from 'types/Filters.types';

import './Header.scss';

type MenuItem = Record<string, RoutePath>;

const MAIN_MENU_ITEMS: MenuItem[] = [
  { path: RoutePath.Items },
  { path: RoutePath.Enchants },
  { path: RoutePath.Skills },
];

const Header: FunctionComponent = () => {
  const { isUpToTablet } = useResponsive();
  const { pathname } = useLocation();
  const [filters, setFilters] = useFilters<GeneralFilters>(FiltersType.General);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isUpToTablet) {
    return renderMobileHeader();
  }

  return renderDesktopHeader();

  function renderDesktopHeader() {
    return (
      <header className="o-header">
        <div className="o-header__container">
          <div className="o-header__left">
            <h1 className="o-header__logo">ChroniconDB</h1>
            <ul className="o-header__main-menu">
              {MAIN_MENU_ITEMS.map((menuItem) => {
                const menuRouteId: RouteId = ROUTES_ID_MAPPING[menuItem.path];
                const { path } = menuItem;
                const isCurrent = pathname === path;

                return (
                  <li
                    className={`o-header__main-menu-item ${isCurrent ? 'current' : ''}`}
                    key={menuRouteId}
                  >
                    <Link to={path}>{menuRouteId}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <ul className="o-header__sub-menu">
            <li className="o-header__sub-menu-item">
              <div className="o-header__sub-menu-patches">
                <Dropdown
                  label="Patch:"
                  defaultValue={filters.patch}
                  options={patches.map(patch => ({ label: patch, value: patch }))}
                  onChange={onPatchChange}
                />
              </div>
            </li>
            <li className={`o-header__sub-menu-item ${pathname === RoutePath.Developers ? 'current' : ''}`}>
              <Link to={RoutePath.Developers}>{RouteId.Developers}</Link>
            </li>
          </ul>
        </div>
      </header>
    );
  }

  function renderMobileHeader() {
    return (
      <header className="o-header">
        <div className="o-header__container">
          <div className="o-header__left">
            <h1 className="o-header__logo">ChroniconDB</h1>
          </div>
          <div className="o-header__right" onClick={() => setIsMobileMenuOpen(true)}>
            <Icon name={IconName.Menu} width={28} />
          </div>
          <Drawer
            className="o-header__menuMobile"
            open={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            handler={false}
            width="50vw"
            placement={'right'}
          >
            <ul className="o-header__menuMobile-items">
              {MAIN_MENU_ITEMS.map((menuItem) => {
                const menuRouteId: RouteId = ROUTES_ID_MAPPING[menuItem.path];
                const { path } = menuItem;
                const isCurrent = pathname === path;

                return (
                  <li
                    className={`o-header__menuMobile-item ${isCurrent ? 'current' : ''}`}
                    key={menuRouteId}
                  >
                    <Link to={path} onClick={() => setIsMobileMenuOpen(false)}>{menuRouteId}</Link>
                  </li>
                );
              })}
              <li className={`o-header__menuMobile-item ${pathname === RoutePath.Developers ? 'current' : ''}`}>
                <Link to={RoutePath.Developers} onClick={() => setIsMobileMenuOpen(false)}>{RouteId.Developers}</Link>
              </li>
              <li className="o-header__menuMobile-item patch">
                <Dropdown
                  label="Patch:"
                  defaultValue={filters.patch}
                  options={patches.map(patch => ({ label: patch, value: patch }))}
                  onChange={onPatchChange}
                />
              </li>
            </ul>
          </Drawer>
        </div>
      </header>
    );
  }

  function onPatchChange(patch: string) {
    setFilters({ patch });
    setIsMobileMenuOpen(false);
  }
};

export default observer(Header);
