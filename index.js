import axios from "axios";
import debug from 'debug';

const func = async (param) => {
  try {
    await axios.get('http://ru.hexle1231t.io')
  } catch (error) {
    console.error(error);
  }
}
func();
debug('page-loader', func)
