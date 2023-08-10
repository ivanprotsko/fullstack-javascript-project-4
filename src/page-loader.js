import axios from 'axios';
import fsp from 'fs/promises';
import jsdom from 'jsdom';
import path from 'path';

const config = {
  tags: [
    { tag: 'link', attribute: 'href' },
    { tag: 'img', attribute: 'src' },
    { tag: 'a', attribute: 'href' },
    { tag: 'script', attribute: 'src' },
  ],
  fileFormats: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'css', 'js'],
};

export const createFolder = (folderPath) => {
  try {
    fsp.mkdir(folderPath);
  } catch (error) {
    console.error(error);
  }
  return 'success';
};
export const doesFolderExist = (folderPath) => fsp.access(folderPath);

export const createName = (url, format) => {
  const link = new URL(url);
  const name = [link.host, link.pathname]
    .join('')
    .split(`.${format}`)
    .join('')
    .split('.')
    .join('-')
    .split('/')
    .join('-');

  const separator = (format === 'files') ? '_' : '.';
  return [name, format].join(separator);
};
export const getFileFormat = (filePath) => {
  const splitPath = filePath.split('.');
  return splitPath[splitPath.length - 1];
};
export const getHtmlElementHref = (element) => {
  const attribute = element.hasAttribute('src') ? 'src' : 'href';
  return element[attribute];
};
const changeDomWithLocalHrefPaths = (elements, directory) => elements.map((elementObject) => {
  const { element, href, fileFormat } = elementObject;
  const filePath = `${directory}/${createName(href, fileFormat)}`;
  const absolutePath = path.resolve(filePath);
  const attribute = element.hasAttribute('src') ? 'src' : 'href';
  element[attribute] = absolutePath;
  return elementObject;
});
const getHtmlElementLinkAttribute = (element) => {
  const attribute = element.hasAttribute('src') ? 'src' : 'href';
  return attribute;
};

export const selectAssetElements = (dom, tags, fileFormats) => {
  const { document } = dom.window;

  const elements = tags.map(({ tag, attribute }) => {
    const HtmlElements = document.querySelectorAll(`${tag}[${attribute}]`);
    return Array.from(HtmlElements);
  })
    .flat()
    .filter((element) => {
      const attribute = getHtmlElementLinkAttribute(element);
      const fileFormat = getFileFormat(element[attribute]);
      return fileFormats.includes(fileFormat);
    })
    .map((element) => {
      const href = getHtmlElementHref(element);
      const fileFormat = getFileFormat(href);
      const fileName = createName(href, fileFormat);
      return {
        element, href, fileName, fileFormat,
      };
    });
  return elements;
};

export const getBinaryDataFromUrl = (href) => axios.get(href, { responseType: 'arraybuffer' })
  .then((response) => Buffer.from(response.data, 'binary').toString('binary'));

const writeBinaryData = (data, filePath) => fsp.writeFile(filePath, data, 'binary');

export const downloadAssetElements = (elements, filesFolder) => elements.map(async (element) => {
  const data = await getBinaryDataFromUrl(element.href);
  await writeBinaryData(data, `${filesFolder}/${element.fileName}`);
});

export default async (url, directory) => {
  const assetsFolderPath = `${directory}/${createName(url, 'files')}`;
  const { tags, fileFormats } = config;

  await doesFolderExist(directory)
    .catch(() => createFolder(directory))
    .then(() => doesFolderExist(assetsFolderPath))
    .catch(() => createFolder(assetsFolderPath))
    .then(() => axios.get(url))
    .then((response) => new jsdom.JSDOM(response.data))
    .then((dom) => {
      const elementObjects = selectAssetElements(dom, tags, fileFormats);
      downloadAssetElements(elementObjects, assetsFolderPath);
      changeDomWithLocalHrefPaths(elementObjects, assetsFolderPath);
      const finalHtml = dom.window.document.documentElement.innerHTML;
      return finalHtml;
    })
    .then((finalHtml) => {
      try {
        fsp.writeFile(
          `${directory}/${createName(url, 'html')}`,
          finalHtml,
          { encoding: 'utf8' },
        );
      } catch (error) {
        console.log(error);
      }
    });
};
