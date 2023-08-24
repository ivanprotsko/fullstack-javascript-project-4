import parseTags from '../parse-string/parse-tags.js';
import extractTagParams from './extract-tag-params.js';
import matchExtension from '../get-data/get-asset-file-extension.js';

export default (html, tags, url, downloadType) => {
  const parsedTags = parseTags(html, tags);
  const links = parsedTags
    .map((tag) => extractTagParams(tag, url, downloadType))
    .filter(
      ({ urlParams, urlParams: { ext } }) => urlParams !== null && ext === matchExtension(ext),
    );
  return links;
};
