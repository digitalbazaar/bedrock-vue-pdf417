<template>
  <div
    class="column full-height"
    style="min-height: 440px">
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
    <slot
      v-if="!loading && !(scanSuccess || scanError)"
      name="instructions">
      <div class="row justify-center">
        Please provide a photo of a PDF417 barcode.
      </div>
    </slot>
    <slot
      v-if="loading"
      name="spinner">
      <div class="row justify-center">
        <Spinner />
      </div>
    </slot>
    <slot
      v-if="scanSuccess"
      name="success">
      <div class="row justify-center q-mx-md">
        <q-icon
          name="fas fa-check-circle"
          class="text-positive"
          style="font-size: 100px" />
        <q-banner
          rounded
          class="text-white bg-green q-mt-md">
          Your photo has been successfully scanned.
        </q-banner>
      </div>
    </slot>
    <slot
      v-if="scanError"
      name="error">
      <div class="row justify-center q-mx-md">
        <q-icon
          name="fas fa-times-circle"
          class="text-red"
          style="font-size: 100px" />
        <q-banner
          rounded
          class="text-white bg-red q-mt-md">
          {{errorText}}
        </q-banner>
      </div>
    </slot>
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
  components: {
    Spinner
  },
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
      loading: false,
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
      this.loading = true;
      this.$emit('loading', true);
      reader.onload = async e => {
        const url = e.target.result;
        this.imageUrl = url;
        this.$emit('imageUrl', url);
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
          this.loading = false;
          this.$emit('loading', false);
        }
      };
      reader.onerror = async () => {
        this.loading = false;
        this.$emit('loading', false);
      };
      reader.readAsDataURL(files[0]);
    },
    reset() {
      this.scanSuccess = false;
      this.scanError = false;
      this.imageUrl = null;
      this.errorText = `There was an error scanning your photo. Please make
        sure the photo is clear and try again.`;
    },
    startScanner() {
      console.log('Scanner Started');
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
