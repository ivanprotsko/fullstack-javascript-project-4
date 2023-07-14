import axios from 'axios';
import fsp from 'fs/promises';

export const getDataFromUrl = async (url) => {
  const response = await axios.get(url)
  return response.data;
};

export const printSuccessMessage = (filePath) => console.log(`The page has been loaded to '${filePath}'`);
export const writeFile = async (path, data) => {
  try {
    fsp.writeFile(path, data);
    return 'success'; // <- returns status for tests
  } catch (error) {
    console.error(error);
  }
}
export const createFolder = (path) => fsp.mkdir(path)
  .then(() => 'success' ); // <- returns status for tests
export const doesFolderExist = (path) => fsp.access(path);
export const createFileName = (url, format = 'html') => {
  const link = new URL(url);
  const formattedFileName = [link.host, link.pathname]
    .join('')
    .split(`.${format}`)
    .join('')
    .split('.')
    .join('-')
    .split('/')
    .join('-');
  const fileName = `${formattedFileName}.${format}`;
  return fileName;
}
export default (url, directory) =>
  doesFolderExist(directory)
    .catch(() => createFolder(directory))
    .then(() => getDataFromUrl(url, directory))
    .then((data) => {
      const filePath = `${directory}/${createFileName(url)}`;
      writeFile(filePath, data);
      return filePath;
    })
    .then((filePath) => printSuccessMessage(filePath));
