import commandLineArgs, { CommandLineOptions } from 'command-line-args';

import { createExtractsFolder } from '../utils/fileUtils';
import { generateMetaFiles } from './generateMetaFiles';
import { generateSearchIndexes } from './generateSearchIndexes';
import { normalizeSourceFiles } from './normalizeSourceFiles';
import { parseArtifacts } from './parseArtifacts';
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

  normalizeSourceFiles(version, verbose);

  createExtractsFolder(version);

  parseItems(version, verbose);
  parseSets(version, verbose);
  parseEnchantsPool(version, verbose);
  parseEnchants(version, verbose);
  parseSkills(version, verbose);
  parseArtifacts(version, verbose);

  generateSearchIndexes(version);
  generateMetaFiles(version);

  return null;
}

parseAll(cliOptions);