<template>
  <q-page
    class="column">
    <!-- <scanner
      :button="true" /> -->
    <BarcodeScanner />
  </q-page>
</template>
<script>
/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {BarcodeScanner} from 'bedrock-vue-pdf417';

export default {
  name: 'Home',
  components: {BarcodeScanner},
  data() {
    return {};
  }
};
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
