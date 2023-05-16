/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';
import {fileURLToPath} from 'url';
import path from 'path';
import '@bedrock/karma';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.karma.suites['bedrock-vue-pdf417'] =
  path.join('web', '**', '*.js');

// TODO: consider moving to `bedrock-karma`?
config.karma.config.webpack.resolve = {
  alias: {
    quasar$: path.resolve(
      __dirname, 'node_modules/quasar/dist/quasar.umd.js')
  },
  modules: [
    path.resolve(__dirname, '..', 'node_modules'),
    path.resolve(__dirname, 'node_modules')
  ]
};
