<template>
  <div class="spinner" />
</template>
<script>
/*!
  * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
  */
'use strict';

export default {
  name: 'Spinner'
};

</script>

<style lang="scss" scoped>

.spinner:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  width: 100px;
  height: 100px;
  margin-top: -100px;
  margin-left: -50px;
  border-radius: 50%;
  border-top: 5px solid #fff;
  border-right: 5px solid transparent;
  animation: spinner .6s linear infinite;
}
@keyframes spinner {
  to {transform: rotate(360deg);}
}

</style>
