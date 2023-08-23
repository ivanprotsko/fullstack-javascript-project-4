import parseLinkValue from '../parse-string/parse-link-value.js';
import parseAttributeValue from '../parse-string/parse-attribute-value.js';
import getUrlType from '../get-type/get-url-type.js';
import getUrlHost from '../get-type/get-url-host.js';
import parseUrlParams from '../parse-string/parse-url-params.js';
import getFinalUrlPath from '../get-path/get-final-url-path.js';
import parseTagName from '../parse-string/parse-tag-name.js';

export default (tag, targetUrl) => {
  const o = {};
  o.tagName = parseTagName(tag);
  o.linkRel = parseAttributeValue(tag, 'rel');
  o.targetUrl = targetUrl;
  o.targetHost = new URL(targetUrl).host;
  o.urlInitial = parseLinkValue(tag);
  o.urlHost = getUrlHost(o, targetUrl);
  o.urlType = getUrlType(o);
  o.urlParams = parseUrlParams(o, targetUrl);
  o.urlFinal = getFinalUrlPath(o);
  return o;
};
