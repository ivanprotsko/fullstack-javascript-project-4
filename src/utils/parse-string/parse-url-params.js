import path from 'path';
import getAssetFileExtension from '../get-data/get-asset-file-extension.js';

export default ({ urlInitial }, targetUrl) => {
  if (urlInitial === null) return null;

  const { host } = new URL(targetUrl);
  const {
    dir, root, ext, name,
  } = path.parse(urlInitial);
  const normalizedDir = dir
    .replace(/^\//, '')
    .replace(/^https?:\/\//, '')
    .replace(host, '');

  const extension = getAssetFileExtension(ext);
  return {
    root, dir: normalizedDir, name, ext: extension,
  };
};
