import path from 'path';
import debug from 'debug';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import Listr from 'listr';
import _ from 'lodash';

const log = debug('page-loader');

const assetFileFormats = ['svg', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'js', 'css', 'woff2', 'ttf', 'otf', 'webp'];
export const formatPath = (pathname) => pathname
  .replace(/^www\./, '') // removes 'www.' from the beginning of a string
  .replace(/^https?:\/\//, '') // removes 'http://' or 'https://'
  .replace(/\/$/, '') // removes the last symbol '/' (example: /some-folder/some-page/ ← the target '/')
  .replace(/^\//g, '') // removes the first (root) symbol '/' if it exists;
  .replace(/\.|\//g, '-') // changes symbols '/' & '.' to '-';
  .replace(/[:/?#[\]@+=&]/g, '-'); //  replace other symbols: [':', '?', '#', '[', ']', '@', '=', '+', '&'];

export const urlToFilename = (slug) => {
  const fileName = formatPath(slug);
  return [fileName, '.html'].join('');
};

export const urlToDirname = (slug) => [formatPath(slug), '_files'].join('');

const clearExtensionParams = (pathName) => {
  if (!pathName) return null;
  return pathName.replace(/\?.*$/g, ''); // deletes all symbols after character '?' in extension, example: '.css?v.1.2';
};

const parseFileFormat = (pathName) => {
  if (!pathName) return null;
  const formattedPath = clearExtensionParams(pathName).split('.');
  const lastElement = formattedPath.length - 1;
  const ext = formattedPath[lastElement];
  return ext === undefined ? null : ext;
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
  const urlParams = {
    host,
    pathname: clearExtensionParams(pathname),
    ext,
  };

  return urlParams;
};

const getAssetFileName = (pathname, prefix, isCanonical = false) => {
  let filename;
  if (isCanonical) {
    filename = [prefix, '-', formatPath(pathname), '.html'].join('');
  } else {
    const { dir, base } = path.parse(pathname);
    filename = [
      prefix,
      formatPath(dir),
      clearExtensionParams(base),
    ].join('-');
  }
  return filename;
};

export const prepareAssets = (html, pageUrlHost, pageUrlOrigin, assetsDirname) => {
  const preparedHTML = html.toString();
  const $ = cheerio.load(preparedHTML);

  // вытянуть все теги со ссылками
  const searchedTags = ['a', 'img', 'link', 'script'];
  const selectedTags = searchedTags
    .map((tag) => $(tag).toArray())
    .flat();

  const assets = selectedTags
    .filter((tag) => {
      const attr = $(tag).attr('src') ? 'src' : 'href';

      const linkValue = $(tag).attr(attr);
      const { host, ext } = getUrlParams(linkValue);

      const isCanonical = $(tag).attr('rel') === 'canonical';
      const isAssetFile = assetFileFormats.join(' ').includes(ext);
      const isPageUrlHost = host === pageUrlHost || host === '/';

      return (isAssetFile && isPageUrlHost) || isCanonical;
    })
    .map((tag) => {
      const attr = $(tag).attr('src') ? 'src' : 'href';
      const value = $(tag).attr(attr);
      const { pathname } = getUrlParams(value);

      const isCanonical = $(tag).attr('rel') === 'canonical';
      const filenamePrefix = formatPath(pageUrlHost);
      const filename = getAssetFileName(pathname, filenamePrefix, isCanonical);

      const asset = {
        url: path.join(pageUrlOrigin, pathname),
        filename,
      };
      asset.filePath = [assetsDirname, '/', asset.filename].join('');
      // Replace html asset link value
      $(tag).attr(attr, asset.filePath);

      return asset;
    });

  const data = {
    html: $.html(),
    assets,
  };
  return data;
};
export const downloadAsset = (dirname, asset) => axios.get(asset.url, { responseType: 'arraybuffer' })
  .then((response) => Buffer.from(response.data, 'binary').toString('binary'))
  .then((data) => {
    const filePath = ['/', dirname, '/', asset.filename].join('');
    return fsp.writeFile(filePath, data, 'binary');
  });

export default (pageUrl, outputDirname = '') => {
  const url = new URL(pageUrl);
  const slug = `${url.hostname}${url.pathname}`;

  const filename = urlToFilename(slug); // преобзразовывем имя в нужный формат
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
      log('create (if not exists) directory for assets', fullOutputAssetsDirname);
    })
    .then(() => fsp.access(fullOutputDirname))
    .catch(() => fsp.mkdir(fullOutputDirname))
    .then(() => {
      log('write html file', fullOutputFilename);
      return fsp.writeFile(fullOutputFilename, data.html);
    })
    .then(() => fsp.access(fullOutputAssetsDirname))
    .catch(() => fsp.mkdir(fullOutputAssetsDirname))
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
