<template>
  <h1 class="title">Three.js journey</h1>
  <nav>
    <RouterLink to="/basics" :class="{ 'disabled' : device == 'mobile' }">
      <div class="row">
        <h2>Basics</h2>
        <p>Move camera, edit mesh, rotate mesh</p>
      </div>
    </RouterLink>
    <RouterLink to="/animations" :class="{ 'disabled' : device == 'mobile' }">
      <div class="row">
        <h2>Animations</h2>
        <p>Animate mesh</p>
      </div>
    </RouterLink>
    <RouterLink to="/camera" :class="{ 'disabled' : device == 'mobile' }">
      <div class="row">
        <h2>Camera</h2>
        <p>PerspectiveCamera, OrthographicCamera and OrbitControls</p>
      </div>
    </RouterLink>
    <RouterLink to="/resizing" :class="{ 'disabled' : device == 'mobile' }">
      <div class="row">
        <h2>Resizing</h2>
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
    <RouterLink to="/materials">
      <div class="row">
        <h2>Material</h2>
        <p>Create and apply materials</p>
      </div>
    </RouterLink>
    <RouterLink to="/text">
      <div class="row">
        <h2>3D text</h2>
        <p>Display 3D texts and texts effects</p>
      </div>
    </RouterLink>
    <RouterLink to="/light">
      <div class="row">
        <h2>Lights</h2>
        <p>Add lights to the scene and explore lights effects</p>
      </div>
    </RouterLink>
    <RouterLink to="/shadow">
      <div class="row">
        <h2>Shadows</h2>
        <p>Add shadows to the scene and explore shadows effects</p>
      </div>
    </RouterLink>
  </nav>
</template>

<script setup>
//==================================
// Import
//==================================
import { RouterLink } from "vue-router";
import { getViewport } from '../utils/screen_size.mjs';
const device = getViewport();

</script>

<style lang="scss" scoped>
$title-h: 88px;
.title {
  width: 100%;
  text-align: center;
  height: $title-h;
  display: grid;
  place-content: center;
}
nav {
  max-width: 1100px;
  width: 100%;
  height: calc( 90vh - $title-h - 24px );
  overflow-y: scroll;
  margin: 12px auto;
  display: flex;
  flex-direction: column;
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 12px;
    padding: 12px;
    height: calc( $title-h / 2);
    align-items: center;
    cursor: pointer;
    background-color: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:hover {
      background-color: var(--primary-02);
      transition-duration: var(--transition-medium);
    }
  }
}
</style>
