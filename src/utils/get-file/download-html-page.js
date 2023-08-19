import getHtmlFromUrl from '../get-data/get-html-from-url.js';
import getFileName from '../get-name/get-file-name.js';
import getFilePath from '../get-path/get-file-path.js';
import writeHtmlPage from './write-html-page.js';

export default (url, directory) => getHtmlFromUrl(url)
  .then(async (data) => {
    const fileName = getFileName(url, 'html');
    const filePath = getFilePath(directory, fileName);
    return writeHtmlPage(data, filePath);
  });
