#!/usr/bin/env node
import pageLoader from '../src/page-loader.js';
import { url, directory, downloadType } from './string-util.js';
import logPageLoader from './log-page-loader.js';

logPageLoader(pageLoader(url, directory, downloadType));
