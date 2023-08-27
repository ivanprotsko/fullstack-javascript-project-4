import fsp from 'fs/promises';
import prettify from 'html-prettify';
import { prepareAssets } from '../src/page-loader.js';

test('Replace links', async () => {
  const { hostname, origin } = new URL('https://ru.hexlet.io/courses');
  const assetsDirname = 'ru-hexlet-io-courses_files';

  const finalHtml = await fsp.readFile(`${process.cwd()}/__fixtures__/final.html`, 'utf8');
  const initialHtml = await fsp.readFile(`${process.cwd()}/__fixtures__/initial.html`, 'utf8');
  const { html } = prepareAssets(initialHtml, hostname, origin, assetsDirname);

  expect(prettify(html))
    .toBe(prettify(finalHtml));
});
