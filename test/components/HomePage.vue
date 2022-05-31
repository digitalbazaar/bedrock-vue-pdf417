<template>
  <q-page class="column">
    <BarcodeScanner
      v-if="!result && !error"
      guide-color="#63C6C2"
      :pdf417="pdf417"
      @result="result = $event"
      @error="error = $event" />
    <q-btn
      v-if="result || error"
      color="primary"
      label="Test Again"
      class="q-ma-md"
      size="xl"
      @click="retry()" />
    <q-list
      v-if="result"
      dense
      padding>
      <q-item
        v-for="(data, dataIndex) in result"
        :key="dataIndex">
        <q-item-section>
          {{data.description}}: {{data.value}}
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="error">
      {{error}}
    </div>
  </q-page>
</template>

<script>
/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {BarcodeScanner} from '@bedrock/vue-pdf417';

export default {
  name: 'HomePage',
  components: {BarcodeScanner},
  data() {
    return {
      pdf417: {
        license: '100902848'
      },
      result: null,
      error: null
    };
  },
  methods: {
    retry() {
      window.scrollTo({top: 0})
      this.result = null;
      this.error = null;
    }
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
