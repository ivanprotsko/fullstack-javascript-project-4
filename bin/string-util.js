import { readFileSync } from 'fs';
import { Command } from 'commander';
import metaData from './package.json' assert { type: 'json' };

// const metaData = JSON.parse(readFileSync('./package.json', 'utf8'));

const program = new Command();
const currentDir = process.cwd();
program
  .name('page-loader')
  .description('Page loader utility')
  .version(metaData.version);
program
  .option('-o, --output <directory>', 'output dir', currentDir)
  .argument('<URL>', 'webpage URL to download');
program
  .parse();

export const [url] = program.args;
export const directory = program.opts().output;
