import nock from 'nock';
import { describe, test, expect } from '@jest/globals';
import getHtmlFromUrl from '../src/utils/get-data/get-html-from-url';

describe('Test of getHtmlFrom url function', () => {
  test('Get html data from URL', async () => {
    const scope = nock('https://ru.hexlet.io')
      .get('/courses')
      .reply(200, 'data');

    await expect(
      getHtmlFromUrl('https://ru.hexlet.io/courses'),
    ).resolves.toBe('data');

    scope.done();
  });
});
