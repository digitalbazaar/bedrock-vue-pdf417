import {scan as scanner} from 'bedrock-web-pdf417';
import * as Comlink from 'comlink';

const obj = {
  async scan(data) {
    const {url} = data;
    return scanner({url});
  }
};

Comlink.expose(obj);
