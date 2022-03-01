<template>
  <div>
    <div
      id="barcodeScannerUI" />
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
      dlInfo: null
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

        this.scanner.soundOnSuccessfulRead = new Audio('./assets/beep.mp3');
        this.scanner.bPlaySoundOnSuccessfulRead = true;
        this.scanner.onUnduplicatedRead = txt => {
          this.dlInfo = this.getDLInfo(txt);
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #barcodeScannerUI {
    width: 100vw;
    height: 100vh;
    /* position: absolute;
    top: 0; */
  }
</style>
