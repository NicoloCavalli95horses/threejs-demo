<template>
  <Btn class="back-btn" @click="$router.push('/')">Back</Btn>
  <RouterView />
</template>

<script setup>
//==================================
// Import
//==================================
import Btn from './components/Btn.vue';
import { RouterView } from "vue-router";

</script>

<style lang="scss" scoped>
  .back-btn {
    position: fixed;
    left: 22px;
    bottom: 22px;
  }
</style>
