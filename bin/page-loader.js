#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from "../src/page-loader.js";

const metaData = {
  name: '@hexlet/code',
  version: '1.0.0',
  description: '',
  main: 'src/page-loader.js',
  scripts: {
    test: 'NODE_OPTIONS=--experimental-vm-modules npx jest',
    'test-watch': 'NODE_OPTIONS=--experimental-vm-modules jest --watch',
  },
  bin: { 'page-loader': './bin/page-loader.js' },
  author: 'Ivan Protsko',
  license: 'ISC',
  type: 'module',
  dependencies: {
    axios: '^1.4.0',
    'axios-debug-log': '^1.0.0',
    cheerio: '^1.0.0-rc.12',
    commander: '^11.0.0',
    debug: '^4.3.4',
    'eslint-plugin-jest': '^27.2.2',
    'html-prettify': '^1.0.7',
    jest: '^29.6.1',
    jsdom: '^22.1.0',
    listr: '^0.14.3',
    lodash: '^4.17.21',
  },
  devDependencies: {
    '@jest/globals': '^29.6.2',
    coverage: '^0.4.1',
    eslint: '^8.44.0',
    'eslint-config-airbnb-base': '^15.0.0',
    'eslint-plugin-fp': '^2.3.0',
    'eslint-plugin-import': '^2.27.5',
    nock: '^13.3.1',
    rimraf: '^5.0.1',
  },
};

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
    pageLoader(str, directory)
  });

program.parse();

// export const url = program.args[0];
//
// export const directory = program.opts().output;
