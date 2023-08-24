import getAssetFilePath from './get-asset-file-path.js';

export default (o) => {
  if (o.urlParams === null) return null;

  const {
    urlInitial, targetUrl, urlHost, urlType, targetHost, urlParams: { dir, name, ext },
  } = o;

  if (urlHost !== 'localhost' && urlHost !== targetHost) return urlInitial;
  if (urlType === 'page-html') return urlInitial;
  if (urlType === 'canonical-page') return getAssetFilePath(targetUrl, dir, name, '.html', targetHost);
  if (urlType === 'asset-file') return getAssetFilePath(targetUrl, dir, name, ext, targetHost);

  return null;
};
