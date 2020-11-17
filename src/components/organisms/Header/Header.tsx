import patches from 'engine/data/patchs.json';
import { useStores } from 'hooks/useStores';
import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { RouteId, RoutePath, ROUTES_ID_MAPPING } from 'routes';
import { UIStore } from 'stores/UIStore';
import { DataStore } from 'types/DataStore.types';

import './Header.scss';
interface Stores {
  uiStore: UIStore;
}
type MenuItem = Record<string, RoutePath>;

const MAIN_MENU_ITEMS: MenuItem[] = [
  { path: RoutePath.Items },
  { path: RoutePath.Enchants },
  { path: RoutePath.Skills },
];

const Header: FunctionComponent = () => {
  const { uiStore } = useStores<Stores>(DataStore.UI);
  const { pathname } = useLocation();

  return (
    <header className="o-header">
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
      <ul className="o-header__sub-menu">
        <li className="o-header__sub-menu-item">
          <div className="o-header__sub-menu-patches">
            <label>Patch: </label>
            {/* TODO: Atom */}
            <select>
              {patches.map(patch => (
                <option
                  key={patch}
                  value={patch}
                  selected={uiStore.currentPatch === patch}
                >
                  {patch}
                </option>
              ))}
            </select>
          </div>
        </li>
        <li className={`o-header__sub-menu-item ${pathname === RoutePath.Developers ? 'current' : ''}`}>
          <Link to={RoutePath.Developers}>{RouteId.Developers}</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
