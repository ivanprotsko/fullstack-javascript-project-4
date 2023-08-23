export default (tag) => {
  const match = tag.match(/<(a|img|link|script)\s/g);
  if (match !== null) return match.join('').replace(/^</g, '').replace(/\s$/g, '');
  return 'null';
};
