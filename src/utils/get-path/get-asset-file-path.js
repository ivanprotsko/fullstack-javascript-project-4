import path from 'path';
import formatPath from './format-path.js';
import getFolderName from '../get-name/get-folder-name.js';

export default (url, dir, name, ext, targetHost) => {
  const prefix = formatPath(targetHost);
  const folder = getFolderName(url, '_files'); // getFolderName(targetUrlHost, 'files');
  const fileName = [prefix, '-', formatPath(path.join(dir, name)), ext].join('');
  return path.join(folder, fileName);
};
