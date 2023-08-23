import axios from 'axios';

export default (href) => axios.get(href, { responseType: 'arraybuffer' })
  .then((response) => Buffer.from(response.data, 'binary').toString('binary'));
