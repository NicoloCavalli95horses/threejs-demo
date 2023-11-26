<template>
  <h1 class="title">Three.js journey</h1>
  <nav>
    <RouterLink to="/basics">
      <div class="row">
        <h2>Basics</h2>
        <p>Move camera, edit mesh, rotate mesh</p>
      </div>
    </RouterLink>
    <RouterLink to="/animations">
      <div class="row">
        <h2>Animations</h2>
        <p>Animate mesh</p>
      </div>
    </RouterLink>
    <RouterLink to="/camera">
      <div class="row">
        <h2>Camera</h2>
        <p>Focus on how camera works</p>
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
.title {
  width: 100%;
  text-align: center;
  margin: 64px auto;
}
nav {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 600px;
  overflow-y: scroll;
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 560px;
    cursor: pointer;
    padding: 10px 16px;
    background-color: transparent;
    border-radius: var(--radius-s);
    &:hover {
      background-color: var(--primary);
      transition-duration: var(--transition-medium);
    }
  }
}
</style>
