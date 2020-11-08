import ScrollToTop from 'components/atoms/ScrollToTop/ScrollToTop';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import Enchants from 'pages/enchants/Enchants';
import Items from 'pages/items/Items';
import React, { FunctionComponent } from 'react';
import { Router } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RoutePath } from 'routes';

import './Main.css';

export const Main: FunctionComponent =  () => {


  return (
    <Router history={createBrowserHistory()}>
      <ScrollToTop />
      <div>
        {/* <Header /> */}

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
      </div>
    </Router>
  );
};

export default observer(Main);