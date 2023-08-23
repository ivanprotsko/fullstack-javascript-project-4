import parseTags from '../parse-string/parse-tags.js';
import extractTagParams from './extract-tag-params.js';
import getAssetFileExtension from '../get-data/get-asset-file-extension.js';

export default (html, tags, url) => {
  const parsedTags = parseTags(html, tags);
  const links = parsedTags
    .map((tag) => extractTagParams(tag, url))
    .filter((link) => {
      if (link.urlParams !== null) {
        const { urlParams: { ext } } = link;
        return ext === getAssetFileExtension(ext);
      }
      return false;
    });
  return links;
};
