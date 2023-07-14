import { createFileName } from '../src/page-loader.js';

test('Create file name', () => {
  expect(
    createFileName('https://ru.hexlet.io/courses', 'html')
  ).toEqual('ru-hexlet-io-courses.html')
});
