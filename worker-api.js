import * as Comlink from 'comlink';

const worker = Comlink.wrap(new Worker('./worker.js', {type: 'module'}));

export const scan = worker.scan;
