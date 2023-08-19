import formatPath from '../get-path/format-path.js';

export default (url, extension = 'ext') => {
  const fileName = formatPath(url);
  return [fileName, extension].join('.');
};
