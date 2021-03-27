import * as fs from 'fs';
import { compact } from 'lodash';
import * as path from 'path';

export const normalizeSourceFiles = (version: string, verbose: boolean) => {
  const sourcePath = path.resolve(__dirname, `../data/${version}/sources/gameExtracts`);
  const distPath = path.resolve(__dirname, `../data/${version}/sources`);

  if (fs.existsSync(sourcePath)) {
    verbose && console.log('Normalizing skills file...');
    normalizeSkillsFile(version, sourcePath, distPath);

    verbose && console.log('Normalizing items file...');
    normalizeItemsFile(version, sourcePath, distPath);

    verbose && console.log('Normalizing enchants list file...');
    normalizeEnchantsListFile(version, sourcePath, distPath);
    // TODO: Generate enchantpool

    verbose && console.log('Normalizing enchants pool file...');
    normalizeEnchantsPoolFile(version, sourcePath, distPath);
  } else {
    if (verbose) {
      console.error(`⚠️ Warning: ${sourcePath} doesn't exist, make sure you placed the gameExtracts in the correct folder. If you are extracting data for a version < to 1.11 this message should be ignored.`);
    }
  }

  verbose && console.log('Every source has been normalized!');
};

const normalizeSkillsFile = (version: string, sourcePath: string, distPath: string) => {
  const skillsFileSource = path.resolve(sourcePath, `skilldata_${version}.txt`);
  const skillsFileDist = path.resolve(distPath, `skilldata_${version}.json`);
  fs.copyFileSync(skillsFileSource, skillsFileDist);
};

const normalizeItemsFile = (version: string, sourcePath: string, distPath: string) => {
  const itemsFileSource = path.resolve(sourcePath, `itemdata_${version}.txt`);
  const itemsFileDist = path.resolve(distPath, `itemlist.txt`);
  fs.copyFileSync(itemsFileSource, itemsFileDist);
};

const normalizeEnchantsListFile = (version: string, sourcePath: string, distPath: string) => {
  const enchantsListFileSource = path.resolve(sourcePath, `enchantlist_${version}.txt`);
  const enchantsListFileDist = path.resolve(distPath, `enchantlist.txt`);
  fs.copyFileSync(enchantsListFileSource, enchantsListFileDist);
};

const normalizeEnchantsPoolFile = (version: string, sourcePath: string, distPath: string) => {
  const enchantsPoolFileSource = path.resolve(sourcePath, `enchantdata_${version}.txt`);
  const enchantsPoolData = compact(fs.readFileSync(enchantsPoolFileSource).toString().split(/\n|\r/));

  const normalizedEnchantsPoolData = enchantsPoolData.map((line) => {
    const [isEnchantLine, enchantName] = line.match(/^\[\*\]\d+\s-\s((?:\w|\s)+)\s-\s.+/) || [];
    if (isEnchantLine) {
      let enchantEffect = '';
      // Matches: [*]86 - Hurt Burn - On hurt: 5% chance to burn attackers for 15/15/25/35/70, 25/25/35/45/90, 30/30/45/60/120, 200% Fire damage per second for 3 seconds when struck
      const [_, classicEnchantEffect] = line.match(/^\[\*\]\d+\s-\s(?:\w|\s)+\s-\s.+,(.+)$/) || [];

      if (classicEnchantEffect) {
        enchantEffect = classicEnchantEffect.trim();
      } else {
        // Matches: [*]93 - Phasewalk - You are no longer affected by collisions and can walk through objects and enemies
        const [_, simpleEnchantEffect] = line.match(/^\[\*\]\d+\s-\s(?:\w|\s)+\s-\s(.+)$/) || [];
        enchantEffect = simpleEnchantEffect.trim();
      }

      return `[*]${enchantName} - ${enchantEffect}`;
    }

    return line;
  });

  const enchantsPoolFileDist = path.resolve(distPath, `enchantpool.txt`);
  fs.writeFileSync(enchantsPoolFileDist, normalizedEnchantsPoolData.join('\n'));
};

// const generateEnchantsList = (version: string, sourcePath: string, distPath: string) => {
//   const enchantsFileSource = path.resolve(sourcePath, `enchantdata_${version}.txt`);
//   const rawEnchants = compact(fs.readFileSync(enchantsFileSource).toString().split(/\n|\r/));

//   const lines = compact(rawEnchants.map((rawEnchant) => {
//     const match = rawEnchant.match(/^\[\*](.*)/);
//     return match ? match[1] : null;
//   }));

//   console.log(lines.length, uniq(lines).length);
// };