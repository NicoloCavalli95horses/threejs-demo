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
        <p>PerspectiveCamera, OrthographicCamera and OrbitControls</p>
      </div>
    </RouterLink>
    <RouterLink to="/resizing">
      <div class="row">
        <h2>Full screen and resizing</h2>
        <p>how to correctly resize webGL canvas</p>
      </div>
    </RouterLink>
    <RouterLink to="/geometry">
      <div class="row">
        <h2>Geometry</h2>
        <p>Three.js geometries and custom geometries</p>
      </div>
    </RouterLink>
    <RouterLink to="/debug">
      <div class="row">
        <h2>Debug</h2>
        <p>Structure a debug interface with lil-gui library</p>
      </div>
    </RouterLink>
    <RouterLink to="/texture">
      <div class="row">
        <h2>Texture</h2>
        <p>Adding texture and effects to geometries</p>
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
  width: 80%;
  min-width: 680px;
  overflow-y: scroll;
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 14px 22px;
    background-color: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:hover {
      background-color: var(--primary);
      transition-duration: var(--transition-medium);
    }
  }
}
</style>
