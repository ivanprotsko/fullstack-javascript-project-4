import fsp from 'fs/promises';

export default (data, path) => fsp.writeFile(path, data, 'utf-8')
  .then(() => fsp.readFile(path, 'utf8'));
