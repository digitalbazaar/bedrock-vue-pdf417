<template>
  <div
    ref="videoContainer"
    class="videoContainer row justify-center items-center">
    <!-- Camera Error -->
    <div
      v-if="cameraError"
      class="text-center">
      <div
        class="row items-center justify-center">
        <q-icon
          color="red-12"
          name="fas fa-times"
          class="icon q-pa-lg" />
      </div>
      <div
        class="q-mt-md"
        style="max-width: 250px">
        There was an error loading your camera. Please upload a photo instead
        or refresh the page.
      </div>
    </div>
    <div
      v-else
      class="row justify-center items-center">
      <!-- Spinners -->
      <div class="full-height row items-center">
        <slot
          v-if="loadingCamera && !scanning"
          name="cameraSpinner">
          <Spinner />
        </slot>
        <slot
          v-if="scanning"
          name="scannerSpinner">
          <Spinner />
        </slot>
      </div>
      <!-- Video Stream -->
      <div class="dce-video-container" />
      <!-- Tip Text -->
      <div
        v-if="!loadingCamera && !scanning"
        ref="tipText"
        class="text-white"
        style="position: absolute;"
        :style="`bottom: calc(${regionTop}% - 30px)`">
        {{tipText}}
      </div>
    </div>

    <!-- Close -->
    <q-btn
      v-if="!loadingCamera && !scanning"
      flat
      fab
      :ripple="false"
      size="16px"
      :color="cameraError ? 'priamry' : 'white'"
      icon="fas fa-times"
      class="q-ma-sm close-btn"
      @click.native="close()" />
    <!-- Buttons -->
    <Buttons
      :loading-camera="loadingCamera"
      :scanning="scanning"
      :camera-list="cameraList"
      @updateCamera="updateCamera($event)"
      @upload="upload($event)" />
  </div>
</template>

<script>
/*!
  * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
  */
import BarcodeReader from '../helpers/dbr.js';
import {BarcodeScanner, EnumBarcodeFormat} from 'dynamsoft-javascript-barcode';
import driverLicenseFields from '../helpers/driverLicenseFields.js';
import Buttons from './Buttons.vue';
import Spinner from './Spinner.vue';

export default {
  name: 'BarcodeScanner',
  components: {
    Buttons,
    Spinner
  },
  props: {
    pdf417: {
      type: Object,
      required: true
    },
    tipText: {
      type: String,
      default: 'Scan barcode on the back of license.'
    },
    guideColor: {
      type: String,
      default: 'rgb(254, 142, 20)'
    }
  },
  data() {
    return {
      loadingCamera: true,
      scanning: false,
      isDestroyed: false,
      scanner: null,
      reader: null,
      dlInfo: null,
      clientHeight: null,
      clientWidth: null,
      regionScale: 0.4,
      cameraList: [],
      currentCamera: null,
      cameraError: false
    };
  },
  computed: {
    regionMaskEdgeLength() {
      const regionMaskEdgeLength =
        this.regionScale * Math.min(this.clientWidth, this.clientHeight);
      return Math.floor(regionMaskEdgeLength);
    },
    regionLeft() {
      const left =
        (this.clientWidth - this.regionMaskEdgeLength) / 2 / this.clientWidth;
      if(this.clientWidth > this.clientHeight) {
        // this creates a percentage
        return Math.round(left * 100) - 25;
      } else {
        // this creates a percentage
        return Math.round(left * 100) - 20;
      }
    },
    regionTop() {
      const top =
        (this.clientHeight - this.regionMaskEdgeLength) / 2 / this.clientHeight;
      // this creates a percentage
      return Math.round(top * 100) - 5;
    },
    region() {
      return {
        // regions are calculated by percent
        regionLeft: this.regionLeft,
        regionRight: 100 - this.regionLeft,
        regionTop: this.regionTop,
        regionBottom: 100 - this.regionTop,
        regionMeasuredByPercentage: 1,
      };
    },
  },
  async mounted() {
    if(!BarcodeReader.license) {
      BarcodeReader.license = this.pdf417.license;
    }
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    await this.showScanner();
    try {
      this.cameraList = await this.scanner.getAllCameras();
      this.currentCamera = await this.scanner.getCurrentCamera();
    } catch(e) {
      console.error(e);
      this.$emit('error', e.message);
    }
  },
  async beforeDestroy() {
    this.isDestroyed = true;
    if(this.scanner) {
      await this.scanner.destroyContext();
    }
  },
  methods: {
    async showScanner() {
      this.loadingCamera = true;
      try {
        this.scanner ||
          (this.scanner = await BarcodeScanner.createInstance());
        const settings = await this.scanner.getRuntimeSettings();
        settings.barcodeFormatIds = EnumBarcodeFormat.BF_PDF417;
        settings.region = this.region;
        settings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];
        settings.deblurLevel = 7;
        this.scanner.updateRuntimeSettings(settings);

        await this.scanner.updateVideoSettings({
          video: {
            width: {
              ideal: 1920
            },
            height: {
              ideal: 1080,
            },
            facingMode: {
              ideal: 'environment',
            }
          },
        });

        this.scanner.onUniqueRead = txt => {
          this.$emit('result', this.getDLInfo(txt));
        };

        this.scanner.dce.regionMaskStrokeStyle = this.guideColor;
        this.scanner.dce.videoFit = 'cover';
        await this.scanner.setUIElement(this.$refs.videoContainer);

        await this.scanner.open();
      } catch(e) {
        console.error(e);
        this.cameraError = true;
      } finally {
        this.loadingCamera = false;
      }
    },
    getDLInfo(txt) {
      const lines = txt.split('\n');
      const abbrs = Object.keys(driverLicenseFields);
      const dlInfo = {};
      lines.forEach((line, i) => {
        let abbr;
        let content;
        if(i === 1) {
          abbr = 'DAQ';
          content = line.substring(line.indexOf(abbr) + 3);
        } else {
          abbr = line.substring(0, 3);
          content = line.substring(3).trim();
        }
        if(abbrs.includes(abbr)) {
          dlInfo[abbr] = {
            description: driverLicenseFields[abbr],
            value: content,
          };
        }
      });
      return dlInfo;
    },
    cvsDrawArea() {
      this.maskCanvas.width = this.clientWidth;
      this.maskCanvas.height = this.clientHeight;
      this.maskCanvasContext.fillStyle = 'rgba(0,0,0,.5)';
      this.maskCanvasContext.fillRect(
        0,
        0,
        this.maskCanvas.width,
        this.maskCanvas.height
      );
      this.maskCanvasContext.globalCompositeOperation = 'destination-out';
      this.maskCanvasContext.fillStyle = 'white';
      this.maskCanvasContext.fillRect(
        (this.regionLeft / 100) * this.maskCanvas.width,
        (this.regionTop / 100) * this.maskCanvas.height,
        ((100 - 2 * this.regionLeft) / 100) * this.maskCanvas.width,
        ((100 - 2 * this.regionTop) / 100) * this.maskCanvas.height
      );
      this.maskCanvasContext.globalCompositeOperation = 'source-over';
      this.maskCanvasContext.lineWidth = 2;
      this.maskCanvasContext.strokeStyle = this.guideColor;
      this.maskCanvasContext.rect(
        (this.regionLeft / 100) * this.maskCanvas.width,
        (this.regionTop / 100) * this.maskCanvas.height,
        ((100 - 2 * this.regionLeft) / 100) * this.maskCanvas.width,
        ((100 - 2 * this.regionTop) / 100) * this.maskCanvas.height
      );
      this.maskCanvasContext.stroke();
    },
    async updateCamera(deviceId) {
      if(this.currentCamera.deviceId === deviceId) {
        return;
      }
      this.loading = true;
      await this.scanner.setCurrentCamera(deviceId);
      this.currentCamera = await this.scanner.getCurrentCamera();
      this.loading = false;
    },
    async upload(event) {
      this.cameraError = false;
      await this.imageScan();

      const files = event.target.files;
      // no file selected
      if(files.length === 0) {
        return;
      }
      for(let i = 0; i < files.length; ++i) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async () => {
          const st = Date.now();
          try {
            this.scanning = true;
            const results = await this.reader.decode(file);
            if(results.length === 0) {
              const message = 'No results found.';
              this.$emit('error', message);
              return;
            }
            this.$emit('result', this.getDLInfo(results[0].barcodeText));
          } catch(e) {
            console.error(e);
            const message = 'There was an error scanning your license. ' +
              'Please try again.';
            this.$emit('error', message);
          } finally {
            const et = Date.now();
            console.log('scan time', (et - st) + 'ms');
            this.scanning = false;
          }
        };
        reader.onerror = async e => {
          console.error(e);
          this.$emit('error', e.message);
        };
        reader.readAsDataURL(files[i]);
      }
    },
    async imageScan() {
      this.reader || (this.reader = await BarcodeReader.createInstance());
      const settings = await this.reader.getRuntimeSettings();
      settings.barcodeFormatIds = EnumBarcodeFormat.BF_PDF417;
      settings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];
      settings.deblurLevel = 7;
      await this.reader.updateRuntimeSettings(settings);
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
  .videoContainer {
    width: 100vw;
    height: 100vh;
    background: #fff;
    position: fixed;
    z-index: 6000;
    top: 0;
    left: 0
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
