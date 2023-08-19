import fsp from 'fs/promises';

export default async (folderPath) => {
  await fsp.mkdir(folderPath);
  return 'the-folder-has-been-created';
};
