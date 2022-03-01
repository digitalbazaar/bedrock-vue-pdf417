<template>
  <div>
    <div
      id="barcodeScannerUI" />
  </div>
</template>

<script>
import DBR from './dbr';
import driverLicenseFields from './driverLicenseFields.js';

export default {
  name: 'BarcodeScanner',
  data() {
    return {
      isLoadingCamera: true,
      isDestroyed: false,
      scanner: null,
      dlInfo: null,
      clientHeight: null,
      clientWidth: null,
      regionScale: 0.4
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
        return Math.round(left * 100) - 25;
      } else {
        return Math.round(left * 100) - 20;
      }
    },
    regionTop() {
      const top =
        (this.clientHeight - this.regionMaskEdgeLength) / 2 / this.clientHeight;
      if(this.clientWidth > this.clientHeight) {
        return Math.round(top * 100) - 5;
      } else {
        return Math.round(top * 100) - 5;
      }
    },
    region() {
      return {
        regionLeft: this.regionLeft,
        regionRight: 100 - this.regionLeft,
        regionTop: this.regionTop,
        regionBottom: 100 - this.regionTop,
        regionMeasuredByPercentage: 1,
      };
    },
  },
  async mounted() {
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    await this.showScanner();
  },
  beforeDestroy() {
    this.isDestroyed = true;
    if(this.scanner) {
      this.scanner.destroy();
    }
  },
  methods: {
    async showScanner() {
      this.isLoadingCamera = true;
      try {
        this.scanner ||
          (this.scanner = await DBR.BarcodeScanner.createInstance());
        const settings = await this.scanner.getRuntimeSettings();
        settings.barcodeFormatIds = DBR.EnumBarcodeFormat.BF_PDF417;
        settings.region = this.region;
        settings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];
        settings.deblurLevel = 7;
        this.scanner.updateRuntimeSettings(settings);

        await this.scanner.updateVideoSettings({
          video: {
            width: 1920,
            height: 1080,
            facingMode: 'environment',
          },
        });

        this.scanner.soundOnSuccessfulRead = new Audio('./assets/beep.mp3');
        this.scanner.bPlaySoundOnSuccessfulRead = true;
        this.scanner.onUnduplicatedRead = txt => {
          this.$emit('dlInfo', this.getDLInfo(txt));
        };

        document.getElementById('barcodeScannerUI')
          .appendChild(this.scanner.getUIElement());
        document.querySelector('#barcodeScannerUI div').style.background = '';
        document.getElementsByClassName('dce-sel-camera')[0].hidden = true;
        document.getElementsByClassName('dce-sel-resolution')[0]
          .hidden = true;
        document.getElementsByClassName('dce-btn-close')[0].hidden = true;
        document.getElementsByClassName('dbrScanner-cvs-scanarea')[0]
          .hidden = true;

        await this.scanner.show();
        this.isLoadingCamera = false;
      } catch(e) {
        console.log(e);
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
  }
};
</script>

<style scoped>
  #barcodeScannerUI {
    width: 100vw;
    height: 100vh;
  }
</style>
