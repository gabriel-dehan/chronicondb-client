import ejs from 'ejs';
import * as fs from 'fs';
import { uniq } from 'lodash';
import * as path from 'path';

import VERSIONS from '../data/patches.json';

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
  const TEMPLATE = `
import enchants from './enchants.json';
import items from './items.json';
import sets from './sets.json';
import skills from './skills.json';
import skillsByClass from './skillsByClass.json';

export default {
  items,
  enchants,
  sets,
  skills,
  skillsByClass,
};`;

  const indexFilePath = path.resolve(__dirname, `../data/${version}/extracts/index.ts`);
  const indexFile = ejs.render(TEMPLATE);

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
