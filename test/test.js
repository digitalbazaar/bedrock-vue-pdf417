/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import '@bedrock/views';
import '@bedrock/webpack';

import './config.js';

import '@bedrock/test';
import '@bedrock/karma';

bedrock.start();
