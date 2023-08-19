import doesFolderExist from './utils/get-folder/does-folder-exist.js';
import createFolder from './utils/get-folder/create-folder.js';
import downloadHtmlPage from './utils/get-file/download-html-page.js';

export default (url, directory) => doesFolderExist(directory)
  .catch(() => createFolder(directory))
  .then(() => downloadHtmlPage(url, directory));

// // Скачать вложения
// Изменить урлы в странице
// Если где-то возникла ошибка, то
// вывести юзеру сообщение
// сохранить данные об ошибке в лог и сказать юзеру где искать логи
