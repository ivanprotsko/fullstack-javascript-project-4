import os from 'os';
import nock from 'nock';
import fsp from 'fs/promises';
import {
  test, expect, afterAll, describe,
} from '@jest/globals';
import writeHtmlPage from '../src/utils/get-file/write-html-page';
import downloadHtmlPage from '../src/utils/get-file/download-html-page';
import getFileName from '../src/utils/get-name/get-file-name';

const url = 'https://subdomain.domain.io/pagename';
const fileName = getFileName(url, 'html');
const fileData = 'page-data';
const temporaryFolder = os.tmpdir();
const filePath = `${temporaryFolder}/${fileName}`;

describe('Test of writeHtmlPage function', () => {
  test('Write file', async () => {
    await expect(writeHtmlPage(fileData, filePath))
      .resolves
      .toEqual(fileData);
  });
});

describe('Test of downloadHtmlPage function', () => {
  const { protocol, host, pathname } = new URL(url);
  const basePath = `${protocol}${host}`;

  test('Success case', async () => {
    const scope = nock(basePath)
      .get(pathname)
      .reply(200, fileData);

    await expect(downloadHtmlPage(url, temporaryFolder))
      .resolves
      .toEqual(fileData);

    scope.done();
  });

  test('Error 404', async () => {
    const scope = nock(basePath)
      .get(pathname)
      .reply(404, fileData);

    await expect(downloadHtmlPage(url, temporaryFolder)
      .catch((e) => e.response.status))
      .resolves
      .toEqual(404);

    scope.done();
  });
});

afterAll(() => fsp.unlink(filePath));
