<template>
  <q-page
    class="column">
    <!-- <scanner
      :button="true" /> -->
    <BarcodeScanner
      @dlInfo="dlInfo = $event" />
    <q-list
      dense
      padding>
      <q-item
        v-for="(info, infoIndex) in dlInfo"
        :key="infoIndex">
        <q-item-section>
          {{info.description}}: {{info.value}}
        </q-item-section>
      </q-item>
    </q-list>
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
    return {
      dlInfo: null
    };
  }
};
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
