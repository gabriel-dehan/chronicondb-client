import ejs from 'ejs';
import * as fs from 'fs';
import { uniq } from 'lodash';
import * as path from 'path';

import VERSIONS from '../data/patches.json';
import {compare} from "compare-versions";

export function generateMetaFiles(version: string) {
  const versions = updatePatches(version);
  generateVersionIndex(version);
  generateVersionsIndex(versions);
}

function updatePatches(version: string): string[] {
  VERSIONS.push(version);

  const patchesPath = path.resolve(__dirname, `../data/patches.json`);
  const versions = uniq(VERSIONS).sort();

  fs.writeFileSync(patchesPath, JSON.stringify(versions, null, 2));

  return versions;
}

function generateVersionIndex(version: string) {
  const hasDlc = compare(version, '1.40.1', '>=');
  const hasCurses = compare(version, '1.60.0', '>=');
  const TEMPLATE = `
<%if (hasDlc) { %>
import artifacts from './artifacts.json';
import artifactsSearchIndex from './artifactsSearchIndex.json';
<% } %>
<%if (hasCurses) { %>
import blessings from './blessings.json';
import blessingsSearchIndex from './blessingsSearchIndex.json';
import curses from './curses.json';
import cursesSearchIndex from './cursesSearchIndex.json';
<% } %>
import enchants from './enchants.json';
import enchantsPool from './enchantsPool.json';
import enchantsSearchIndex from './enchantsSearchIndex.json';
import items from './items.json';
import itemsSearchIndex from './itemsSearchIndex.json';
import sets from './sets.json';
import skills from './skills.json';
import skillsByClass from './skillsByClass.json';
import skillsSearchIndex from './skillsSearchIndex.json';

export default {
  <%if (hasDlc) { %>
  artifacts,
  artifactsSearchIndex,
  <% } %>
  <%if (hasCurses) { %>
  blessings,
  blessingsSearchIndex,
  curses,
  cursesSearchIndex,
  <% } %>
  items,
  enchants,
  enchantsPool,
  sets,
  skills,
  skillsByClass,
  itemsSearchIndex,
  enchantsSearchIndex,
  skillsSearchIndex,
};`;

  const indexFilePath = path.resolve(__dirname, `../data/${version}/extracts/index.ts`);
  const indexFile = ejs.render(TEMPLATE, { hasDlc, hasCurses });

  fs.writeFileSync(indexFilePath, indexFile);
}

function generateVersionsIndex(versions: string[]) {
  const TEMPLATE = `
<%_ versions.forEach((version) => { -%>
import <%= 'V' + version.replace(/\\./g, '') %> from './<%= version %>/extracts';
<%_ }); _%>

export default {
<% versions.forEach((version) => { -%>
  '<%= version %>': <%= 'V' + version.replace(/\\./g, '') %>,
<% }); -%>
};`;

  const indexFilePath = path.resolve(__dirname, `../data/index.ts`);
  const indexFile = ejs.render(TEMPLATE, { versions });

  fs.writeFileSync(indexFilePath, indexFile);
}
