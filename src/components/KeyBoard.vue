<template>
  <div class="keys-wrapper">
    <h3>Camera</h3>
    <p>Zoom in  <code>period</code></p>
    <p>Zoom out  <code>slash</code></p>
    <p>Left <code>arrowLeft</code></p>
    <p>Right  <code>arrowRight</code></p>
    <p>Up  <code>arrowUp</code></p>
    <p>Down  <code>arrowDown</code></p>
    <h3>Mesh scale</h3>
    <p>Scale x  <code>a, d</code></p>
    <p>Scale y  <code>w, s</code></p>
    <p>Scale z <code>z, x</code></p>
    <h3>Mesh rotate</h3>
    <p>Rotate x  <code>f, h</code></p>
    <p>Rotate y  <code>t, g</code></p>
    <p>Rotate z <code>v, b</code></p>
  </div>
</template>
<script setup>
// ==============
// Import
// ==============
import {
  ref,
  onMounted,
  onUnmounted,
} from "vue";

// ==============
// Import
// ==============
const props = defineProps({
  step: {
    type: Number,
    default: 1,
  },
  keys: Object,
});

const emit = defineEmits([
  'change-x',
  'change-y',
  'change-z',
]);


// ==============
// Consts
// ==============
const key_down = ref( null );


// ==============
// Functions
// ==============
function onKeyDown(e) {
  key_down.value = e.code;
  switch ( key_down.value ) {
    case props.keys.y.minus:
      emit('change-y', -props.step);
      break;
    case props.keys.y.plus:
      emit('change-y', props.step);
      break;
    case props.keys.x.minus:
      emit('change-x', -props.step);
      break;
    case props.keys.x.plus:
      emit('change-x', props.step);
      break;
    case props.keys.z.minus:
      emit('change-z', props.step);
      break;
    case props.keys.z.plus:
      emit('change-z', -props.step);
      break;
  }
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
})


</script>

<style lang="scss" scoped>
.keys-wrapper {
  position: fixed;
  bottom: 12px;
  right: 12px;
  color: white;
  .key, code {
    font-family: monospace;
    padding: 4px 8px;
    border: 1px solid rgb(255, 255, 255, 0.4);
    border-radius: 4px;
  }
}
</style>