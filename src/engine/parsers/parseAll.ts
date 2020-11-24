import commandLineArgs, { CommandLineOptions } from 'command-line-args';

import { createExtractsFolder } from '../utils/fileUtils';
import { generateMetaFiles } from './generateMetaFiles';
import { parseEnchants } from './parseEnchants';
import { parseEnchantsPool } from './parseEnchantsPool';
import { parseItems } from './parseItems';
import { parseSets } from './parseSets';
import { parseSkills } from './parseSkills';

const optionDefinitions = [
  { name: 'verbose', alias: 'd', type: Boolean },
  { name: 'version', alias: 'v', type: String },
];

const cliOptions = commandLineArgs(optionDefinitions);

function parseAll(opts: CommandLineOptions) {
  const { verbose, version } = opts;
  const parseEnchantPool = false;

  /* Used for pseudo manual parsing for enchantsPool,
   * extracted from https://steamcommunity.com/sharedfiles/filedetails/?id=835123683
   * using emacs macros into enchantsPoolByName. This method fetches the UUIDs and
   * generates a new `enchantsPool.json` file.
   * It doesn't need to be run for each version as the enchantsPoolByName.json file
   * needs to be manually updated.
   */
  if (parseEnchantPool) {
    parseEnchantsPool();
  }

  createExtractsFolder(version);

  parseItems(version, verbose);
  parseSets(version, verbose);
  parseEnchants(version, verbose);
  parseSkills(version, verbose);

  generateMetaFiles(version);

  return null;
}

parseAll(cliOptions);