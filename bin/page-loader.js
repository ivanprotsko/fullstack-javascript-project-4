#!/usr/bin/env node
import pageLoader from '../src/page-loader.js';
import { url, directory } from './string-util.js';

pageLoader(url, directory);
