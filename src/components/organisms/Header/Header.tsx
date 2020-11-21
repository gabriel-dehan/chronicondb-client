

import React, { FunctionComponent, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react';

import Dropdown from 'components/atoms/Dropdown/Dropdown';
import patches from 'engine/data/patchs.json';
import useQueryParams from 'hooks/useQueryParams';
import { useStores } from 'hooks/useStores';
import { RouteId, RoutePath, ROUTES_ID_MAPPING } from 'routes';
import { UIStore } from 'stores/UIStore';
import { DataStore } from 'types/DataStore.types';

import './Header.scss';

type QueryParams = {
  patch?: string;
};

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
  const [params, setQueryParams] = useQueryParams<QueryParams>();
  const currentPatch = params.patch || uiStore.currentPatch;

  useEffect(() => {
    if (params.patch) {
      uiStore.setCurrentPatch(params.patch);
    }
  });

  return (
    <header className="o-header">
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
              defaultValue={currentPatch}
              options={patches.map(patch => ({ label: patch, value: patch }))}
              onChange={onPatchChange}
            />
          </div>
        </li>
        <li className={`o-header__sub-menu-item ${pathname === RoutePath.Developers ? 'current' : ''}`}>
          <Link to={RoutePath.Developers}>{RouteId.Developers}</Link>
        </li>
      </ul>
    </header>
  );

  function onPatchChange(patch: string) {
    uiStore.setCurrentPatch(patch);
    setQueryParams({ patch });
  }
};

export default observer(Header);
