import nock from 'nock';
import {
  describe, test, expect, afterAll,
} from '@jest/globals';
import fsp from 'fs/promises';
import pageLoader from '../src/page-loader.js';

const downloadsFolder = '__fixtures__/downloads';
const url = 'https://subdomain.domain.io/pagename2';
const { protocol, host, pathname } = new URL(url);
const basePath = `${protocol}${host}`;
const pageData = 'page-loader-data';
const fileName = 'subdomain-domain-io-pagename2.html';
const filePath = `${process.cwd()}/__fixtures__/downloads/${fileName}`;

describe('Test of pageLoaderApp function', () => {
  test('Success case', async () => {
    const scope = nock(basePath)
      .get(pathname)
      .reply(200, pageData);

    await expect(pageLoader(url, downloadsFolder))
      .resolves
      .toEqual(pageData);

    scope.done();
  });
});

afterAll(() => fsp.unlink(filePath));
