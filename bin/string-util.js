import { readFileSync } from 'fs';
import { Command } from 'commander';

const metaData = JSON.parse(readFileSync('./package.json'));
const program = new Command();

program
  .name('page-loader')
  .description('The util downloads webpage.\n')
  .version(metaData.version);
program
  .option('-o, --output <directory>', 'output dir', 'tmp')
  .argument('<URL>', 'webpage URL to download');
program
  .parse();

export const [url] = program.args;
export const directory = program.opts().output;
