import { urlToDirname } from '../src/page-loader.js';

test('Url to dirname', () => {
  expect(urlToDirname('ru.hexlet.io/courses')).toBe('ru-hexlet-io-courses_files');
});
