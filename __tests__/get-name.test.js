import { describe, test, expect } from '@jest/globals';
import getFileName from '../src/utils/get-name/get-file-name';
import getFolderName from '../src/utils/get-name/get-folder-name';

describe('Test of getName function', () => {
  test('Get html page name', () => {
    expect(getFileName('https://ru.hexlet.io/courses', 'html'))
      .toEqual('ru-hexlet-io-courses.html');
  });

  test('Get assets folder name', () => {
    expect(getFolderName('https://ru.hexlet.io/courses', 'files', '_'))
      .toEqual('ru-hexlet-io-courses_files');
  });
});
