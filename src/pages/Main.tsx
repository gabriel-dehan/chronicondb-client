import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { Router } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import { createBrowserHistory, createHashHistory } from 'history';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

import Loader from 'components/atoms/Loader/Loader';
import ScrollToTop from 'components/atoms/ScrollToTop/ScrollToTop';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import Layout from 'layouts/Default';
import DevelopersPage from 'pages/developers/Developers';
import EnchantsPage from 'pages/enchants/Enchants';
import ItemPage from 'pages/items/Item';
import ItemsPage from 'pages/items/Items';
import SkillPage from 'pages/skills/Skill';
import SkillsPage from 'pages/skills/Skills';
import { RoutePath } from 'routes';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const Main: FunctionComponent =  () => {
  const engine = useEngine();
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const history = useRef(createHashHistory());
  const [engineLoaded, setEngineLoaded] = useState(engine.loaded);

  useEffect(() => {
    // Load engine data
    autorun(() => {
      setEngineLoaded(false);
      if (!engine.loaded && filtersStore.currentPatch) {
        // First load
        engine.loadData().then(() => setEngineLoaded(true));
      } else {
        // Subsequent version changes
        engine.loadVersion(filtersStore.currentPatch).then(() => setTimeout(() => setEngineLoaded(true), 500));
      }
    });
  }, []);

  return (
    <Router history={history.current}>
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route path="/">
            {!engineLoaded ? (
              <Loader width={100} height={100} color="var(--color-element-yellow)" />
            ) : (
              <Switch>
                <Route exact path={RoutePath.Items} component={ItemsPage} />
                <Route exact path={RoutePath.Item} component={ItemPage} />
                <Route exact path={RoutePath.Enchants} component={EnchantsPage} />
                <Route exact path={RoutePath.Skills} component={SkillsPage} />
                <Route exact path={RoutePath.Skill} component={SkillPage} />
                <Route exact path={RoutePath.Developers} component={DevelopersPage} />

                <Route>
                  <Redirect to={RoutePath.Items} />
                </Route>
              </Switch>
            )}

          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default observer(Main);