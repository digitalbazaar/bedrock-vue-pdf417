/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const path = require('path');
require('bedrock-views');

config.paths.cache = path.join(__dirname, '.cache');

// add pseudo packages
config.views.bundle.packages.push({
  path: path.join(__dirname, 'components'),
  manifest: path.join(__dirname, 'package.json')
});
