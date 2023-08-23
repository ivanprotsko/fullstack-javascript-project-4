export default (url, postfix = '') => {
  const fileName = url
    .replace(/^https?:\/\//, '') // removes 'http://' or 'https://'
    .replace(/\/$/, '') // removes the last symbol '/' (example: /some-folder/some-page/ ← the target '/')
    .replace(/^\//g, '') // removes the first (root) symbol '/' if it exists;
    .replace(/\.|\//g, '-') // changes symbols '/' & '.' to '-';
    .replace(/[:/?#[\]@+=&]/g, '-'); //  replace other symbols: [':', '?', '#', '[', ']', '@', '=', '+', '&'];

  return [fileName, postfix].join('');
};
