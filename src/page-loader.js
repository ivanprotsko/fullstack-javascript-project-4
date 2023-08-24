import doesFolderExist from './utils/get-folder/does-folder-exist.js';
import createFolder from './utils/get-folder/create-folder.js';
import getFileName from './utils/get-name/get-file-name.js';
import getFilePath from './utils/get-path/get-file-path.js';
import writeHtmlPage from './utils/get-file/write-html-page.js';
import replaceLinks from './utils/replace-links.js';
import downloadAssetsElements from './utils/get-file/download-assets-elements.js';
import extractLinksFromHtml from './utils/generate-structure/extract-links-from-html.js';
import getFolderName from './utils/get-name/get-folder-name.js';
import getHtmlDataFromUrl from './utils/get-data/get-html-from-url.js';

export default (url, directory, downloadType) => {
  const fileName = getFileName(url, 'html');
  const filePath = getFilePath(directory, fileName);
  const assetFolderPath = `${directory}/${getFolderName(url, '_files')}`;
  const searchedTags = ['a', 'img', 'link', 'script'];

  return doesFolderExist(directory)
    .catch(() => createFolder(directory))
    .then(() => doesFolderExist(assetFolderPath))
    .catch(() => createFolder(assetFolderPath))
    // download html page
    .then(() => getHtmlDataFromUrl(url))
    .then((data) => writeHtmlPage(data, filePath))
    // download images
    .then((html) => {
      const assetFileLinks = extractLinksFromHtml(html, searchedTags, url, downloadType);
      const updatedHtml = replaceLinks(html, assetFileLinks);
      writeHtmlPage(updatedHtml, filePath);
      return assetFileLinks;
    })
    .then((links) => {
      const assetFilesLinks = links.filter((link) => {
        const {
          urlParams: { ext }, urlType, urlHost, targetHost,
        } = link;
        return (ext !== null && urlType === 'asset-file' && (urlHost === targetHost || urlHost === 'localhost'));
      });
      downloadAssetsElements(assetFilesLinks, directory);
    });
};
