<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="text-center">
          Bedrock PDF417 Scanner Test
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer />
  </q-layout>
</template>

<script>
export default {
  name: 'BrRoot'
};
</script>

<style>
</style>
