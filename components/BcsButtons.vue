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
      dropdown-icon="none"
      :disabled="loadingCamera || scanning">
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
      :disabled="loadingCamera || scanning"
      @click="$refs.uploadImage.click()" />
  </q-btn-group>
</template>

<script>
/*!
  * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
  */

export default {
  name: 'BcsButtons',
  props: {
    cameraList: {
      type: Array,
      default: undefined
    },
    loadingCamera: {
      type: Boolean,
      default: undefined
    },
    scanning: {
      type: Boolean,
      default: undefined
    }
  },
  emits: [
    'upload',
    'updateCamera'
  ],
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
