/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
require('bedrock-karma');
require('bedrock-views');
require('bedrock-webpack');
require('./config');

require('bedrock-test');
bedrock.start();
