export default ({ urlInitial }, targetUrl) => {
  try {
    const urlInitialHost = new URL(urlInitial).host;
    const targetUrlHost = new URL(targetUrl).host;
    if (urlInitialHost !== targetUrlHost) return urlInitialHost;
    return urlInitialHost;
    // Get asset files from subdomains
    // const urlInitialDomain = parseDomainFromHost(urlInitialHost);
    // const targetUrlDomain = parseDomainFromHost(targetUrlHost);
    // if (urlInitialDomain !== targetUrlDomain) return targetUrlHost;
    // return 'localhost';
  } catch (e) {
    return 'localhost';
  }
};
