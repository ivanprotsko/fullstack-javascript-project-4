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
  .option('-o, --debug-name-space <name-space>', 'runs debug-js', 'page-loader')
  .argument('<URL>', 'webpage URL to download');
program
  .parse();

export const [url] = program.args;
export const directory = program.opts().output;
console.log(program.opts());
