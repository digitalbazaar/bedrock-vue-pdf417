<template>
  <div class="spinner" />
</template>
<script>
/*!
  * Copyright (c) 2021-2024 Digital Bazaar, Inc. All rights reserved.
  */
export default {
  name: 'BcsSpinner'
};

</script>

<style lang="scss" scoped>

.spinner {
  content: '';
  box-sizing: border-box;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border-top: 5px solid #393A39;
  border-right: 5px solid transparent;
  animation: spinner .6s linear infinite;
}
@keyframes spinner {
  to {transform: rotate(360deg);}
}

</style>
