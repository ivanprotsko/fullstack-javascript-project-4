import fsp from 'fs/promises';

export default async (folderPath) => {
  await fsp.access(folderPath);
  return 'folder-exists';
};
