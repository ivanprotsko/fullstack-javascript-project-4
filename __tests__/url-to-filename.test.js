import { urlToFilename } from '../src/page-loader.js';

test('Url to filename', () => {
  expect(urlToFilename('ru.hexlet.io/courses')).toBe('ru-hexlet-io-courses.html');
})
