<template>
  <div class="q-mx-md">
    <div class="row justify-center">
      <input
        ref="file"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileUpload">
      <q-btn
        v-if="button"
        class="q-mb-md"
        :color="color ? '' : 'primary'"
        :style="color ? `background: ${color}` : ''"
        text-color="white"
        label="Provide Photo"
        @click="reset(); $refs.file.click()" />
    </div>
    <div>
      <div
        v-if="scanSuccess || scanError">
        <div v-if="scanSuccess">
          <q-icon
            name="fas fa-check-circle"
            class="text-positive"
            style="font-size: 100px" />
        </div>
        <div v-if="scanError">
          <q-icon
            name="fas fa-times-circle"
            class="text-red"
            style="font-size: 100px" />
        </div>
      </div>
      <div
        v-else
        class="row justify-center">
        <div
          v-show="!imageUrl">
          <slot name="instructions">
            Please provide a photo of a PDF417 barcode.
          </slot>
        </div>
        <img
          v-if="imageUrl"
          class="q-mt-md"
          :src="imageUrl"
          style="width: 100%; height: 100%; max-width: 500px;">
      </div>
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
import {scan} from '@digitalbazaar/bedrock-web-pdf417';
import Spinner from './Spinner.vue';

export default {
  name: 'Scanner',
  props: {
    button: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#1976d2',
      required: false
    }
  },
  data() {
    return {
      imageUrl: null,
      scanSuccess: false,
      scanError: false,
      errorText: `There was an error scanning your photo. Please make
        sure the photo is clear and try again.`
    };
  },
  computed: {},
  methods: {
    async handleFileUpload(e) {
      const files = e.target.files;

      // no file selected
      if(files.length === 0) {
        return;
      }

      const reader = new FileReader();
      this.$q.loading.show({
        delay: 0, // ms
        spinner: Spinner,
        message: 'Scanning your photo! Hang on...'
      });
      reader.onload = async e => {
        const url = e.target.result;
        this.imageUrl = url;
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
      reader.onerror = async () => {
        this.$q.loading.hide();
      };
      reader.readAsDataURL(files[0]);
    },
    reset() {
      this.scanSuccess = false;
      this.scanError = false;
      this.imageUrl = null;
      this.errorText = `There was an error scanning your photo. Please make
        sure the photo is clear and try again.`;
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
