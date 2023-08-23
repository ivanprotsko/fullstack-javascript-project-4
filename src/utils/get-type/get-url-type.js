export default ({ linkRel, fileExtension, tagName }) => {
  if (linkRel === 'canonical') return 'canonical-page';
  if (tagName === 'a') return 'page-html';
  if (fileExtension !== null || fileExtension !== 'html') return 'asset-file';
  return null;
};
