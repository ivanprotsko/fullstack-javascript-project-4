#!/usr/bin/env node
import pageLoader from '../src/page-loader.js';
import { url, directory } from './string-util.js';
import { logPageLoader } from './log-page-loader.jg';

logPageLoader(pageLoader(url, directory));
