import path from 'path';
import nock from 'nock';
import fsp from 'fs/promises';
import axios from 'axios';
import prettify from 'html-prettify';
import { prepareAssets } from '../src/page-loader.js';

test('Download files', async () => {
  const getPath = (pathname) => {
    return path.join(`${process.cwd()}/__fixtures__/nock-files`, pathname);
  };

  const fileCss = await fsp.readFile(getPath('assets/styles.css'), 'utf8');
  const fileJs = await fsp.readFile(getPath('assets/scripts.js'), 'utf8');
  const fileJpg = await fsp.readFile(getPath('assets/me.jpg'), 'binary');

  const scope = nock('https://site.com')
    .get('/blog/about/assets/styles.css')
    .reply(200, 'data');

  // axios.get('https://site.com/blog/about/assets/styles.css')
  //   .then((response) => {
  //     fsp.writeFile('file---------2.css', response.data);
  //   })
  expect(axios.get('https://site.com/blog/about/assets/styles.css'))
    .resolves.toBe('data');


  scope.done();
});
