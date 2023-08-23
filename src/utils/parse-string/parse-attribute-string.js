export default (tag, attribute) => {
  const expression = `${attribute}=["|']([^"';]*)"|'`;
  const regexp = new RegExp(expression, 'g');
  return tag.match(regexp);
};
