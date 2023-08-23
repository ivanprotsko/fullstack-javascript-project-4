const defaultFormats = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.js', '.css'];
export default (ext, formats = defaultFormats) => {
  const resultFormat = formats.filter((format) => ext === format).join('');
  if (resultFormat !== '') return resultFormat;
  return null;
};
