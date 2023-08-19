import { describe, test, expect } from '@jest/globals';
import formatPath from '../src/utils/get-path/format-path.js';

describe('Test of getPath function', () => {
  test('Format path', () => {
    expect(
      formatPath('/assets/images/'),
    ).toEqual('assets-images');
  });

  test('Format URI', () => {
    expect(
      formatPath('https://ru.hexlet.io/courses'),
    ).toEqual('ru-hexlet-io-courses');
  });

  test('Format complex path', () => {
    expect(
      formatPath('https:///a:b?c#d[e]a@b=c+d&e/a'),
    ).toEqual('a-b-c-d-e-a-b-c-d-e-a');
  });
});
