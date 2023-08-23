import parseAttributeString from './parse-attribute-string.js';

export default (tag, attribute) => {
  const attributeString = parseAttributeString(tag, attribute);
  if (attributeString) {
    const lineStartCutExp = `^${attribute}="`;
    const lineStartCutRegExp = new RegExp(lineStartCutExp, 'g');

    // Cut " from the end of the string
    const value = attributeString.join('').replace(/"$/g, '').replace(lineStartCutRegExp, '');
    // Cut ${attribute}=" from the beginning of the string
    return value.replace(lineStartCutRegExp, '');
  }
  return null;
};
