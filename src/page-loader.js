import fsp from 'fs/promises';
import doesFolderExist from './utils/get-folder/does-folder-exist.js';
import createFolder from './utils/get-folder/create-folder.js';
import getFileName from './utils/get-name/get-file-name.js';
import getFilePath from './utils/get-path/get-file-path.js';
import writeHtmlPage from './utils/get-file/write-html-page.js';
import { getHtmlDataFromUrl } from '../drafts/page-loader-old.js';
import replaceLinks from './utils/replace-links.js';
import downloadAssetsElements from './utils/get-file/download-assets-elements.js';
import extractLinksFromHtml from './utils/generate-structure/extract-links-from-html.js';
import getFolderName from './utils/get-name/get-folder-name.js';

export default (url, directory) => {
  const fileName = getFileName(url, 'html');
  const filePath = getFilePath(directory, fileName);
  const assetFolderPath = `${directory}/${getFolderName(url, '_files')}`;
  const searchedTags = ['a', 'img', 'link'];

  return doesFolderExist(directory)
    .catch(() => createFolder(directory))
    .then(() => doesFolderExist(assetFolderPath))
    .catch(() => createFolder(assetFolderPath))
    .then(() => getHtmlDataFromUrl(url))
    .then((data) => writeHtmlPage(data, filePath))
    .then((html) => {
      const links = extractLinksFromHtml(html, searchedTags, url);
      const processedHtml = replaceLinks(html, links);
      fsp.writeFile(filePath, processedHtml);
      return links;
    })
    .then((links) => {
      const assetFilesLinks = links.filter((link) => link.urlParams.ext !== null);
      const name = `${directory}/o.js`;
      console.log(assetFilesLinks);
      fsp.writeFile(name, JSON.stringify(assetFilesLinks, null, 4), 'utf8');
      downloadAssetsElements(assetFilesLinks, directory);
    });
};
