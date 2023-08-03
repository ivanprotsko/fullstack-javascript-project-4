import { createName } from '../src/page-loader.js';

test('Create file name', () => {
  expect(
    createName('https://ru.hexlet.io/courses', 'html')
  ).toEqual('ru-hexlet-io-courses.html')
});
