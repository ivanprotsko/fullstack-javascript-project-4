import parseSrc from './parse-src.js';
import parseAttributeValue from './parse-attribute-value.js';

export default (tag) => (parseSrc(tag) ? parseAttributeValue(tag, 'src') : parseAttributeValue(tag, 'href'));
