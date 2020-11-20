import React, { FunctionComponent } from 'react';
import { Router } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';

import ScrollToTop from 'components/atoms/ScrollToTop/ScrollToTop';
import Layout from 'components/layouts/Default';
import Enchants from 'pages/enchants/Enchants';
import Items from 'pages/items/Items';
import { RoutePath } from 'routes';

export const Main: FunctionComponent =  () => {

  return (
    <Router history={createBrowserHistory()}>
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route path="/">
            <Switch>
              <Route exact path={RoutePath.Items} component={Items} />
              <Route exact path={RoutePath.Enchants} component={Enchants} />

              <Route>
                <Redirect to={RoutePath.Items} />
              </Route>
            </Switch>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default observer(Main);