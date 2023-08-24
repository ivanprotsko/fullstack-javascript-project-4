import fsp from 'fs/promises';
import { test, expect } from '@jest/globals';
import parseTags from '../src/utils/parse-string/parse-tags.js';
import parsedTagsFixture from '../__fixtures__/parse-tags/parsed-tags-fixture.js';

test('parseTags function test', async () => {
  const html = await fsp.readFile('__fixtures__/parse-tags/tags.html', 'utf8');
  const searchedTags = ['a', 'img', 'link', 'script'];
  const parsedTags = parseTags(html, searchedTags);
  expect(parsedTags).toEqual(parsedTagsFixture);
});
