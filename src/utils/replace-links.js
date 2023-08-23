const replaceLinks = (html, links, iteration = 0) => {
  let newHtml = '';
  let newIteration;

  const { urlInitial, urlFinal } = links[iteration];
  const regex = new RegExp(urlInitial, 'g');

  newHtml = html.replace(regex, urlFinal).replace(/\s\/>/g, '>');

  if (iteration < links.length) {
    newIteration = iteration + 1;
    return newIteration === links.length ? newHtml : replaceLinks(newHtml, links, newIteration);
  }

  return null;
};

export default replaceLinks;
