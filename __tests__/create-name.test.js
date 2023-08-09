import { createName } from '../src/page-loader.js';

test('Create file name', () => {
  expect(
    createName('https://ru.hexlet.io/courses', 'html')
  ).toEqual('ru-hexlet-io-courses.html')
});
test('Create assets folder name', () => {
  expect(
    createName('https://ru.hexlet.io/courses', 'files')
  ).toEqual('ru-hexlet-io-courses_files')
});
