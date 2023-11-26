<template />
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
  'x',
  'y',
  'z',
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
      emit('y', -props.step);
      break;
    case props.keys.y.plus:
      emit('y', props.step);
      break;
    case props.keys.x.minus:
      emit('x', -props.step);
      break;
    case props.keys.x.plus:
      emit('x', props.step);
      break;
    case props.keys.z.minus:
      emit('z', props.step);
      break;
    case props.keys.z.plus:
      emit('z', -props.step);
      break;
  }
}

// ==============
// Life cycle
// ==============
onMounted( () => window.addEventListener('keydown', onKeyDown));
onUnmounted( () => window.removeEventListener('keydown', onKeyDown));

</script>