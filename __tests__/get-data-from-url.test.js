import nock from 'nock';
import { getBinaryDataFromUrl } from '../src/page-loader.js';

test('Get data from URL', async () => {
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, 'data');
  try {
    await expect(
      getBinaryDataFromUrl('https://ru.hexlet.io/courses'),
    ).resolves.toBe('data');
  } catch (e) {
    console.error(e);
  }
  scope.done();
});
