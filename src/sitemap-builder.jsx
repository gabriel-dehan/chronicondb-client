import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Sitemap from 'react-router-sitemap';

import Data from './engine/data/index';
import { RoutePath } from './routes';

const patches = Object.values(Data);
const lastPatch = patches[patches.length - 1];
const { items, skills } = lastPatch;

const paramsConfig = {
  [RoutePath.Item]: items.map(item => ({ uuid: item.uuid })),
  [RoutePath.Skill]: skills.map(skill => ({ uuid: skill.uuid })),
};

(
  new Sitemap(
    <Switch>
      <Route exact path={RoutePath.Items} />
      <Route exact path={RoutePath.Item} />
      <Route exact path={RoutePath.Enchants} />
      <Route exact path={RoutePath.Skills} />
      <Route exact path={RoutePath.Skill} />
      <Route exact path={RoutePath.Artifacts} />
      <Route exact path={RoutePath.Developers} />
    </Switch>
  )
    .applyParams(paramsConfig)
    .build('https://chronicondb.com')
    .save('./sitemap.xml')
);
