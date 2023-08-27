import { Command } from 'commander';
import fsp from 'fs/promises';

const json = fsp.readFile('./package.json');

const metaData = JSON.parse(json.toString());

const program = new Command();
const currentDir = process.cwd();
const downloadOptionDescription = '\'domain\' setting downloads all assets, include assets placed on subdomains of the domain, \'host\' downloads only assets placed at its host.';
program
  .name('page-loader')
  .description('Page loader utility')
  .version(metaData.version);
program
  .option('-o, --output <directory>', 'output dir', currentDir)
  .option('-d, --download <type>', downloadOptionDescription, 'host')
  .argument('<URL>', 'webpage URL to download');
program
  .parse();

export const [url] = program.args;
export const directory = program.opts().output;
export const downloadType = program.opts().download;
