import path from 'path';
import debug from 'debug';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import Listr from 'listr';
import _ from 'lodash';

const log = debug('page-loader');

export const formatPath = (pathname) => pathname
  .replace(/^www\./, '')
  .replace(/^https?:\/\//, '') // removes 'http://' or 'https://'
  .replace(/\/$/, '') // removes the last symbol '/' (example: /some-folder/some-page/ ← the target '/')
  .replace(/^\//g, '') // removes the first (root) symbol '/' if it exists;
  .replace(/\.|\//g, '-') // changes symbols '/' & '.' to '-';
  .replace(/[:/?#[\]@+=&]/g, '-'); //  replace other symbols: [':', '?', '#', '[', ']', '@', '=', '+', '&'];

export const urlToHtmlFilename = (slug) => {
  const fileName = formatPath(slug);
  return [fileName, '.html'].join('');
};

export const urlToDirname = (slug) => [formatPath(slug), '_files'].join('');

const formatPathExtension = (pathName) => {
  if (!pathName) return null;
  return pathName.replace(/\?.*$/g, '');
}; // delete all symbols after '?' in extension
const parseFileFormat = (pathName) => {
  if (!pathName) return null;
  const formattedPath = formatPathExtension(pathName).split('.');
  const lastElement = formattedPath.length - 1;
  const ext = formattedPath[lastElement];
  return ext === undefined ? null : ext;
};

const getAssetFileName = (pathname, prefix = '') => {
  const { dir, base, ext } = path.parse(pathname);

  let filename;
  if (!ext) {
    if (pathname === '/') filename = [prefix, '.html'].join('');
    else filename = [prefix, '-', formatPath(pathname), '.html'].join('');
  }
  if (ext) {
    filename = [
      prefix,
      formatPath(dir),
      formatPathExtension(base),
    ].join('-');
  }

  return filename;
};

const getUrlParams = (value) => {
  if (!value) return null;

  let pathname; let
    host;
  try {
    const valueUrl = new URL(value);
    pathname = valueUrl.pathname;
    host = valueUrl.host;
  } catch (e) {
    pathname = value;
    host = '/';
  }
  const ext = parseFileFormat(pathname);

  return { host, pathname: formatPathExtension(pathname), ext: formatPathExtension(ext) };
};

export const prepareAssets = (html, urlHost, urlOrigin, assetsDirname) => {
  const preparedHTML = html.toString();
  const $ = cheerio.load(preparedHTML);

  const searchedTags = ['img', 'link', 'script'];
  const selectedTags = searchedTags.map((tag) => $(tag).toArray()).flat();

  const assets = [];

  selectedTags.forEach((tag) => {
    const attr = $(tag).attr('src') ? 'src' : 'href';
    const value = $(tag).attr(attr);
    if (!value) return null;

    const { pathname, host } = getUrlParams(value);

    if (host === urlHost || host === '/') {
      const filenamePrefix = urlHost.replace(/\./g, '-');
      const filename = getAssetFileName(pathname, filenamePrefix);
      const asset = {
        url: path.join(urlOrigin, formatPathExtension(pathname)),
        filename,
      };
      asset.filePath = [assetsDirname, '/', asset.filename].join('');
      // Replace html asset link value
      $(tag).attr(attr, asset.filePath);

      assets.push(asset);
    }
    return null;
  });

  const data = {
    html: $.html(),
    assets,
  };
  return data;
};
export const downloadAsset = (dirname, asset) => axios.get(asset.url, { responseType: 'arraybuffer' })
  .then((response) => {
    const filePath = path.join(dirname, asset.filename);
    return fsp.writeFile(filePath, response.data, 'binary');
  });

export default (pageUrl, outputDirname = '') => {
  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;

  const filename = urlToHtmlFilename(slug); // преобзразовывем имя в нужный формат
  const assetsDirname = urlToDirname(slug);

  const fullOutputDirname = path.resolve(process.cwd(), outputDirname);
  const fullOutputFilename = path.join(fullOutputDirname, filename);
  const fullOutputAssetsDirname = path.join(fullOutputDirname, assetsDirname);

  let data;
  const promise = axios.get(pageUrl)
    .then((response) => {
      data = prepareAssets(
        response.data,
        url.hostname,
        url.origin,
        assetsDirname,
      ); // функция, которая парсит html
      log('create (if not exists) directory for the page and its assets', fullOutputAssetsDirname);
      return fsp.access(fullOutputDirname)
        .catch(() => fsp.mkdir(fullOutputDirname));
    })
    .then(() => {
      log('write html file', fullOutputFilename);
      return fsp.writeFile(fullOutputFilename, data.html);
    })
    .then(() => {
      log('create (if not exists) directory for assets', fullOutputAssetsDirname);
      return fsp.access(fullOutputAssetsDirname)
        .catch(() => fsp.mkdir(fullOutputAssetsDirname));
    })
    .then(() => {
      data.assets
        .map((asset) => downloadAsset(fullOutputAssetsDirname, asset)
          .catch(_.noop));
      const tasks = data.assets.map((asset) => {
        console.log(asset.url);
        log('asset', asset.url, asset.filename);
        return {
          title: asset.url,
          task: () => downloadAsset(
            fullOutputAssetsDirname,
            asset,
          ).catch(_.noop), // функция загрузки и записи конкретного ресурса
        };
      });
      const listr = new Listr(tasks, { concurrent: true });
      return listr.run();
    });

  // Возвращаем из функции промис,
  // чтобы можно было отслеживать состояние в вызывающем коде.
  return promise;
};
