<template>
  <div class="overlay"
    @mousemove="onMouseMove"
    @mousewheel="onMousewheel"
  />
</template>

<script setup>
// ==============
// Import
// ==============


// ==============
// Consts
// ==============
const emit = defineEmits([
  'mousemove',
  'mousewheel',
]);

// ==============
// Functions
// ==============
function onMouseMove( e ){
  const perc = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }
  emit('mousemove', perc);
}

function onMousewheel(e) {
  const wheel = e.deltaY / 100;
  emit('mousewheel', wheel);
}

</script>

<style>
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  top: 0;
  left: 0;
  user-select: none;
  touch-action: none;
}
</style>
