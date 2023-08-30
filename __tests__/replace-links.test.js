import path from 'path';
import fsp from 'fs/promises';
import prettify from 'html-prettify';
import { prepareAssets } from '../src/page-loader.js';

test('Replace links', async () => {
  const { hostname, origin } = new URL('https://ru.hexlet.io/courses');
  const assetsDirname = 'ru-hexlet-io-courses_files';

  const getPath = (pathname) => {
    return path.join(`${process.cwd()}/__fixtures__/replace-links`, pathname);
  };
  const finalHtml = await fsp.readFile(getPath('final.html'), 'utf8');
  const initialHtml = await fsp.readFile(getPath('initial.html'), 'utf8');

  const { html } = prepareAssets(initialHtml, hostname, origin, assetsDirname);

  expect(prettify(html))
    .toBe(prettify(finalHtml));
});
