import { urlToHtmlFilename } from '../src/page-loader.js';

test('Url to filename', () => {
  expect(urlToHtmlFilename('ru.hexlet.io/courses')).toBe('ru-hexlet-io-courses.html');
});
