import * as fs from 'fs';
import { compact, uniq } from 'lodash';
import * as path from 'path';

export const normalizeSourceFiles = (version: string, verbose: boolean) => {
  const sourcePath = path.resolve(__dirname, `../data/${version}/sources/gameExtracts`);
  const distPath = path.resolve(__dirname, `../data/${version}/sources`);

  if (fs.existsSync(sourcePath)) {
    verbose && console.log('Normalizing skills file...');
    normalizeSkillsFile(version, sourcePath, distPath);

    verbose && console.log('Normalizing items file...');
    normalizeItemsFile(version, sourcePath, distPath);

    // TODO: Generate enchants list
    verbose && console.log('Generating enchants list...');
    generateEnchantsList(version, sourcePath, distPath);
    // TODO: Generate enchantpool
  } else {
    if (verbose) {
      console.error(`⚠️ Warning: ${sourcePath} doesn't exist, make sure you placed the gameExtracts in the correct folder. If you are extracting data for a version < to 1.11 this message should be ignored.`);
    }
  }

  throw Error();
};

const normalizeSkillsFile = (version: string, sourcePath: string, distPath: string) => {
  const skillsFileSource = path.resolve(sourcePath, `skilldata_${version}.txt`);
  const skillsFileDist = path.resolve(distPath, `skilldata_${version}.json`);
  fs.copyFileSync(skillsFileSource, skillsFileDist);
};

const normalizeItemsFile = (version: string, sourcePath: string, distPath: string) => {
  const skillsFileSource = path.resolve(sourcePath, `itemdata_${version}.txt`);
  const skillsFileDist = path.resolve(distPath, `itemlist.txt`);
  fs.copyFileSync(skillsFileSource, skillsFileDist);
};


const generateEnchantsList = (version: string, sourcePath: string, distPath: string) => {
  const enchantsFileSource = path.resolve(sourcePath, `enchantdata_${version}.txt`);
  const rawEnchants = compact(fs.readFileSync(enchantsFileSource).toString().split(/\n|\r/));

  const lines = compact(rawEnchants.map((rawEnchant) => {
    const match = rawEnchant.match(/^\[\*](.*)/);
    return match ? match[1] : null;
  }));

  console.log(lines.length, uniq(lines).length);
};