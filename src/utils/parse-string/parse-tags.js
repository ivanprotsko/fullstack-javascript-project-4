export default (html, tags) => {
  const expression = `<(${tags.join('|')}).*?>`;
  const regexp = new RegExp(expression, 'g');
  const match = html.match(regexp);
  return match !== undefined ? match : null;
};
