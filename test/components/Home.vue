<template>
  <q-page
    class="column q-col-gutter-md background"
    padding>
    <scanner
      :errorText="errorText" />
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
      errorText: `There was an error scanning your photo. Please make
        sure the photo is clear and try again.`
    };
  }
};
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
