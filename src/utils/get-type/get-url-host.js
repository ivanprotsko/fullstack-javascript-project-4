import parseDomainFromHost from '../parse-string/parse-domain-from-host.js';

export default ({ urlInitial }, targetUrl, downloadType = 'host') => {
  try {
    switch (downloadType) {
      case 'domain': {
        const urlInitialHost = new URL(urlInitial).host;
        const targetUrlHost = new URL(targetUrl).host;
        const urlInitialDomain = parseDomainFromHost(urlInitialHost);
        const targetUrlDomain = parseDomainFromHost(targetUrlHost);

        if (urlInitialDomain !== targetUrlDomain) return targetUrlHost;
        if (urlInitialDomain === targetUrlDomain) return 'localhost';

        return null;
      }
      case 'host': {
        const urlInitialHost = new URL(urlInitial).host;
        const targetUrlHost = new URL(targetUrl).host;

        if (urlInitialHost !== targetUrlHost) return urlInitialHost;
        if (urlInitialHost === targetUrlHost) return 'localhost';

        return null;
      }
      default: return null;
    }
  } catch (e) {
    return 'localhost';
  }
};
