import getBinaryDataFromUrl from '../get-data/get-binary-data.js';
import writeBinaryData from './write-binary-data.js';

export default (links, directory) => links.map(async (link) => {
  const { urlFinal } = link;
  const filePath = `${directory}/${urlFinal}`;
  const data = await getBinaryDataFromUrl(link.urlInitial);
  await writeBinaryData(data, filePath);
});
