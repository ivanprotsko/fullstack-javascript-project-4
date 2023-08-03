import axios from 'axios';
import fsp from 'fs/promises';
import jsdom from 'jsdom';
import _ from 'lodash';
import path from 'path';

export const getPath = (directory, url, format) => `${directory}/${createName(url, format)}`;

export const createFolder = async (path) => {
  try {
    await fsp.mkdir(path);
    return 'success';
  } catch (error) {
    console.error(error);
  }
};

export const doesFolderExist = (path) => {
  try {
    return fsp.access(path)
  } catch (error) {
    console.error(error);
  }
};

export const createName = (url, format) => {
  const link = new URL(url);
  const name = [link.host, link.pathname]
    .join('').split(`.${format}`)
    .join('').split('.')
    .join('-').split('/').join('-');

  const separator = (format === 'files') ? '_' : '.';
  return [name, format].join(separator);
};

const requiredTags = [
  { tag: 'link', attribute: 'href', },
  { tag: 'img', attribute: 'src', },
  { tag: 'a', attribute: 'href', },
  { tag: 'script', attribute: 'src', },
];

const getHtmlElementLinkAttribute = (element) => element.hasAttribute('src') ? 'src' : 'href';

export const selectAssetElements = (dom, tags) => {
  const document = dom.window.document;

  const elements = tags.map(({ tag, attribute }) => {
      return Array.from(document.querySelectorAll(`${tag}[${attribute}]`));
    })
    .flat()
    .filter((element) => {
      const attribute = getHtmlElementLinkAttribute(element);
      const fileFormat = getFileFormat(element[attribute]);
      const searchingFormats = [fileFormats.base64, fileFormats.utf8].flat();
      return searchingFormats.includes(fileFormat);
    });
  return elements;
};

export const getDataTypeByHref = (format) => {
  if (format === 'png' || format === 'jpg' || format === 'jpeg' || format === 'gif') return 'base64';
  else return 'utf8';
};

export const getHtmlElementHref = (element) => {
  const attribute = element.hasAttribute('src') ? 'src' : 'href';
  return element[attribute];
};

const fileFormats = {
  base64: ['png', 'jpg', 'jpeg', 'gif'],
  utf8: ['svg', 'css', 'js'],
};

const getDataType = (format, formats) => {
  let type = '';
  formats.base64.forEach((fileFormat) => {
    if (fileFormat === format) type = 'base64';
  });
  formats.utf8.forEach((fileFormat) => {
    if (fileFormat === format) type = 'utf8';
  });
  return type;
};

const getFileFormat = (path) => path.split('.').pop();
export const downloadAssetElements = (elements, filesFolder) => {
  const paths = [];

  elements.map(async (element) => {
    const href = getHtmlElementHref(element);
    const fileFormat = getFileFormat(href);
    const dataType = getDataType(fileFormat, fileFormats);
    const filePath = getPath(filesFolder, href, fileFormat, 'file');

    paths.push(filePath);

    switch (dataType) {
      case 'base64': await axios.get(href, { responseType: 'arraybuffer' })
          .then((response) => Buffer.from(response.data, 'binary').toString('base64'))
          .then((data) => fsp.writeFile(filePath, data, dataType));
        break;
      case 'utf8': await axios.get(href)
          .then((response) => fsp.writeFile(filePath, response.data, dataType));
        break;
      default: console.log('\'dataType\' undefined');
    }
  });

  return paths;
};

const updateAssetHtmlElementUrls = (elementsList) => {
  elementsList.map(([ element, path ]) => {
    const attribute = element.hasAttribute('src') ? 'src' : 'href';
    element[attribute] = path;
  });
}

const joinAssetElementsAndTheirPaths = (elements, paths) => {
  const list = [];
  for (let i = 0; i < elements.length; i += 1) {
    const absolutePath = path.resolve(paths[i]);
    list.push([elements[i], absolutePath]);
  }
  return list;
}

export default async (url, directory) => {
  const assetsFolderPath =  getPath(directory, url, 'files')
  let assetElements;
  let assetElementPaths;
  let pageDom;

  console.log(path.resolve('tmp'));
  await doesFolderExist(directory)
    .catch(() => createFolder(directory))
    .then(() => doesFolderExist(assetsFolderPath))
    .catch(() => createFolder(assetsFolderPath))
    .then(() => axios.get(url))
    .then((response) => pageDom = new jsdom.JSDOM(response.data))
    .then((dom) => assetElements = selectAssetElements(dom, requiredTags))
    .then((assets) => assetElementPaths = downloadAssetElements(assets, assetsFolderPath))
    .then(() => joinAssetElementsAndTheirPaths(assetElements, assetElementPaths ))
    .then((elementsList) => updateAssetHtmlElementUrls(elementsList))
    .then(() => fsp.writeFile(
      getPath(directory, url, 'html', 'file'),
      pageDom.window.document.documentElement.innerHTML,
      {encoding: 'utf8'}));
};
