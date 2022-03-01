<template>
  <div>
    <div
      id="barcodeScannerUI" />
    <div class="row justify-center">
      {{text}}
    </div>
  </div>
</template>

<script>
import DBR from './dbr';

export default {
  name: 'BarcodeScanner',
  data() {
    return {
      isLoadingCamera: true,
      isDestroyed: false,
      scanner: null,
      text: 'No result'
    };
  },
  async mounted() {
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
        settings.region = {
          regionLeft: 5,
          regionTop: 5,
          regionRight: 95,
          regionBottom: 95,
          regionMeasuredByPercentage: 1
        };
        settings.localizationModes = [16, 8, 2, 0, 0, 0, 0, 0];
        settings.deblurLevel = 7;
        this.scanner.updateRuntimeSettings(settings);

        this.scanner.onUnduplicatedRead = (txt, result) => {
          this.text = txt;
        };

        document.getElementById('barcodeScannerUI')
          .appendChild(this.scanner.getUIElement());
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #barcodeScannerUI {
    width: 100vw;
    height: 100vh;
    /* position: absolute;
    top: 0; */
  }
</style>
