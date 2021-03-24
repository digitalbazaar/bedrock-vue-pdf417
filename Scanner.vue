<template>
  <div>
    <div class="row justify-center">
      <input
        ref="file"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileUpload">
      <q-btn
        color="blue"
        text-color="white"
        label="Provide Photo"
        @click="reset(); $refs.file.click()" />
    </div>
    <div class="row justify-center">
      <div
        v-show="!image"
        class="q-mt-md">
        <slot name="instructions">
          Please provide a photo of a PDF417 barcode.
        </slot>
      </div>
      <img
        v-if="image"
        class="q-mt-md"
        :src="image.src"
        style="width: 100%; height: 100%; max-width: 500px;">
    </div>
    <div
      v-if="scanSuccess || scanError"
      class="q-mt-md q-mx-auto"
      style="max-width: 500px;">
      <q-banner
        v-if="scanSuccess"
        rounded
        class="text-white bg-green">
        Your photo has been successfully scanned.
      </q-banner>
      <q-banner
        v-if="scanError"
        rounded
        class="text-white bg-red">
        {{errorText}}
      </q-banner>
    </div>
  </div>
</template>
<script>
/*!
  * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
  */
'use strict';

import {scan} from 'bedrock-web-pdf417';
import Spinner from './Spinner.vue';

export default {
  name: 'Scanner',
  props: {},
  data() {
    return {
      image: null,
      scanSuccess: false,
      scanError: false,
      errorText: `There was an error scanning your photo. Please make
        sure the photo is clear and try again.`
    };
  },
  computed: {

  },
  methods: {
    async handleFileUpload(e) {
      const url = URL.createObjectURL(e.target.files[0]);
      this.image = new Image();
      this.$q.loading.show({
        delay: 0, // ms
        spinner: Spinner,
        message: 'Scanning your photo! Hang on...'
      });
      this.image.onload = async () => {
        const st = Date.now();
        try {
          const result = await scan({url});
          if(!result) {
            throw new Error('PDF417 barcode not found.');
          }
          console.log('SUCCESSFULLY DECODED', result);
          this.scanSuccess = true;
          this.$emit('result', result);
        } catch(e) {
          console.error(e);
          this.scanError = true;
          this.$emit('result', false);
        } finally {
          const et = Date.now();
          console.log('scan time', (et - st) + 'ms');
          this.$q.loading.hide();
        }
      };
      this.image.onerror = async () => {
        this.$q.loading.hide();
      };
      this.image.src = url;
    },
    reset() {
      this.scanSuccess = false;
      this.scanError = false;
      this.image = null;
      this.errorText = `There was an error scanning your photo. Please make
        sure the photo is clear and try again.`;
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
