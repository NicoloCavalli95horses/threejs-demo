<template>
  <nav>
    <h1 class="bottom-36">Three.js journey</h1>
    <RouterLink to="/basics">
      <div class="row">
        <h2>Basics</h2>
        <p>Move camera, edit mesh, rotate mesh</p>
      </div>
    </RouterLink>
  </nav>
</template>

<script setup>
//==================================
// Import
//==================================
import { RouterLink } from "vue-router";

</script>

<style lang="scss" scoped>
nav {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 56px);
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 560px;
    cursor: pointer;
    padding: 8px 12px;
    background-color: transparent;
    border-radius: var(--radius-s);
    &:hover {
      background-color: var(--primary);
      transition-duration: var(--transition-medium);
    }
  }
}
</style>
