import nock from 'nock';
import { getBinaryDataFromUrl } from '../src/page-loader.js';

const scope = nock('https://ru.hexlet.io')
  .get('/courses')
  .reply(200, 'data');

test('Get data from URL', async () => {
  expect(
    await getBinaryDataFromUrl('https://ru.hexlet.io/courses')
  ).toEqual('data');
})
