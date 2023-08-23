import fsp from 'fs/promises';
import { describe, test, expect } from '@jest/globals';
import replaceLinks from '../src/utils/replace-links.js';
import parseTags from '../src/utils/parse-string/parse-tags.js';
import extractTagParams from '../src/utils/generate-structure/extract-tag-params.js';

describe('Test of pageLoaderApp function', () => {
  test('Success case', async () => {
    const url = 'https://ru.hexlet.io/courses';

    const initial = await fsp.readFile(`${process.cwd()}/__fixtures__/initial.html`, 'utf8');
    const final = await fsp.readFile(`${process.cwd()}/__fixtures__/final.html`, 'utf8');

    const tags = parseTags(initial, ['script', 'a', 'link', 'img']);
    const links = tags
      .map((tag) => extractTagParams(tag, url))
      .filter((link) => link.urlFinal !== null);
    console.log(links);
    const processedHtml = replaceLinks(initial, links);
    expect(processedHtml).toBe(final);
  });
});
