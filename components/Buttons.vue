<template>
  <q-btn-group
    class="buttons full-width"
    style="height: 50px; border-radius: 0"
    spread>
    <!-- Camera Button -->
    <q-btn-dropdown
      flat
      no-caps
      text-color="white"
      label="Camera"
      style="font-weight: 600"
      icon="fas fa-video"
      dropdown-icon="none">
      <q-list>
        <q-item
          v-for="camera in cameraList"
          :key="camera.deviceId"
          v-close-popup
          clickable
          @click="updateCamera(camera.deviceId)">
          <q-item-section>
            <q-item-label>{{camera.label}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <!-- Upload Button -->
    <input
      ref="uploadImage"
      type="file"
      accept="image/png,image/jpeg,image/bmp,image/gif"
      style="display: none"
      @change="upload($event)">
    <q-btn
      flat
      no-caps
      text-color="white"
      label="Upload"
      style="border-left: 1px solid #62605e; font-weight: 600"
      icon="fas fa-file-upload"
      @click="$refs.uploadImage.click()" />
  </q-btn-group>
</template>

<script>
/*!
  * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
  */

export default {
  name: 'Buttons',
  components: {

  },
  props: {
    cameraList: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      sound: true
    };
  },
  computed: {},
  methods: {
    updateCamera(deviceId) {
      this.$emit('updateCamera', deviceId);
    },
    upload(event) {
      this.$emit('upload', event);
    }
  }
};
</script>

<style scoped>
  .buttons {
    position: fixed;
    bottom: 0px;
    opacity: 0.9;
    background-color: #393A39;
  }
</style>
