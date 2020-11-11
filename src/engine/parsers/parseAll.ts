import commandLineArgs, { CommandLineOptions } from 'command-line-args';

import { parseEnchants } from './parseEnchants';
import { parseItems } from './parseItems';


const optionDefinitions = [
  { name: 'verbose', alias: 'd', type: Boolean },
  { name: 'version', alias: 'v', type: String },
];

const cliOptions = commandLineArgs(optionDefinitions);

function parseAll(opts: CommandLineOptions) {
  const { verbose, version } = opts;

  const items = parseItems(version, verbose);
  const enchants = parseEnchants(version, verbose);
}

parseAll(cliOptions);