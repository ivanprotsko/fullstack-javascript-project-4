#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import pageLoader from '../src/page-loader.js';

const metaData = JSON.parse(readFileSync('./package.json'));

const program = new Command();
const currentDir = process.cwd();
program
  .name('page-loader')
  .description('Page loader utility')
  .version(metaData.version);
program
  .option('-o, --output <directory>', 'output dir', currentDir)
  .argument('<URL>', 'webpage URL to download')
  .action((str, options) => {
    const directory = options.output;
    pageLoader(str, directory);
  });

program.parse(process.argv);
