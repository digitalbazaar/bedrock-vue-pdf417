/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';
import {fileURLToPath} from 'url';
import path from 'path';
import '@bedrock/views';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.paths.cache = path.join(__dirname, '.cache');

// add pseudo packages
config.views.bundle.packages.push({
  path: path.join(__dirname, 'components'),
  manifest: path.join(__dirname, 'package.json')
});
