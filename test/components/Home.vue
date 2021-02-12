<template>
  <q-page
    class="column q-col-gutter-md background"
    padding>
    <scanner />
  </q-page>
</template>
<script>
/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {Scanner} from 'bedrock-vue-pdf417';

export default {
  name: 'Home',
  components: {Scanner},
  data() {
    return {

    };
  }
};
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
