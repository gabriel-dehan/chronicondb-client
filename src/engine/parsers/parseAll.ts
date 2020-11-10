import commandLineArgs, { CommandLineOptions } from 'command-line-args';

import { parseItems } from './parseItems';

const optionDefinitions = [
  { name: 'silent', alias: 's', type: Boolean },
  { name: 'version', alias: 'v', type: String },
];

const cliOptions = commandLineArgs(optionDefinitions);

function parseAll(opts: CommandLineOptions) {
  const { silent, version } = opts;
  const debug = !silent;

  const items = parseItems(version, debug);

  console.log(items);
}

parseAll(cliOptions);