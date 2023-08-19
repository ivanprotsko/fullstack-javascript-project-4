import formatPath from '../get-path/format-path.js';

export default (url, postfix = '', separator = '_') => {
  const fileName = formatPath(url);
  return [fileName, postfix].join(separator);
};
