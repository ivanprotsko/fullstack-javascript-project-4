import fsp from 'fs/promises';

export default (data, filePath) => fsp.writeFile(filePath, data, 'binary');
