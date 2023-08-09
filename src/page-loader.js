import axios from 'axios';
import fsp from 'fs/promises';
import jsdom from 'jsdom';
import _ from 'lodash';
import path from 'path';

const config = {
  tags: [
    { tag: 'link', attribute: 'href', },
    { tag: 'img', attribute: 'src', },
    { tag: 'a', attribute: 'href', },
    { tag: 'script', attribute: 'src', },
  ],
  fileFormats: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'css', 'js'],
}

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

const changeDomWithLocalHrefPaths = (elements, directory) => {
    elements.map((elementObject) => {
        const { element, assetsFolderPath, href, fileFormat } = elementObject;
        const filePath = `${directory}/${createName(href, fileFormat)}`;
        const absolutePath = path.resolve(filePath);
        const attribute = element.hasAttribute('src') ? 'src' : 'href';
        element[attribute] = absolutePath;
    });
    return elements;
}
const getHtmlElementLinkAttribute = (element) => element.hasAttribute('src') ? 'src' : 'href';

export const selectAssetElements = (dom, tags, fileFormats) => {
  const document = dom.window.document;

  const elements = tags.map(({ tag, attribute }) => {
      return Array.from(document.querySelectorAll(`${tag}[${attribute}]`));
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
        return { element, href, fileName, fileFormat };
    });
  return elements;
};

export const getHtmlElementHref = (element) => {
  const attribute = element.hasAttribute('src') ? 'src' : 'href';
  return element[attribute];
};

const getBinaryDataFromUrl = async (href) => {
    return await axios.get(href, { responseType: 'arraybuffer' })
        .then((response) => Buffer.from(response.data, 'binary').toString('binary'));
}
const writeBinaryData = async (data, path) => await fsp.writeFile(path, data, 'binary');

const getFileFormat = (path) => path.split('.').pop();
export const downloadAssetElements = (elements, filesFolder) => {
  return elements.map(async (element) => {
    const data = await getBinaryDataFromUrl(element.href);
    await writeBinaryData(data, `${filesFolder}/${element.fileName}`);
  });
};

export default async (url, directory) => {
  const assetsFolderPath = `${directory}/${createName(url, 'files')}`;
  const { tags, fileFormats } = config;
  let pageDom;
  let finalHtml;

  console.log(path.resolve('tmp'));
  await doesFolderExist(directory)
    .catch(() => createFolder(directory))
    .then(() => doesFolderExist(assetsFolderPath))
    .catch(() => createFolder(assetsFolderPath))
    .then(() => axios.get(url))
    .then((response) => pageDom = new jsdom.JSDOM(response.data))
    .then((dom) => selectAssetElements(dom, tags, fileFormats))
    .then((elementObjects) => finalHtml = changeDomWithLocalHrefPaths(elementObjects, assetsFolderPath))
    .then((elementObjects) => downloadAssetElements(elementObjects, assetsFolderPath))
    .then(() => {
      const finalHtml = pageDom.window.document.documentElement.innerHTML;
      fsp.writeFile(
        `${directory}/${createName(url, 'html')}`,
        finalHtml,
        {encoding: 'utf8'}
      )
    });
};
