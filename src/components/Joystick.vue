<template>
  <div
    class="joystick"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="cursor"
      ref="cursor_ref"
      :style="{
        transform: `translate(${cursor_perc.x_perc}%, ${cursor_perc.y_perc}%)`,
      }"
    />
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, onMounted, computed } from "vue";

// ==============
// Props and emits
// ==============
const emit = defineEmits(["move"]);

// ==============
// Consts
// ==============
const isDragging = ref(false);
const handleX = ref(0);
const handleY = ref(0);
const cursor_ref = ref(undefined);
const cursor_rect = ref(undefined);

const cursor_perc = computed(() => {
  return {
    x_perc: getAbsPerc(handleX.value),
    y_perc: getAbsPerc(handleY.value),
  };
});

// ==============
// Functions
// ==============
function getAbsPerc(px) {
  return mapNumber(px, -1, 1, -50, 50);
}

function mapNumber(value, inMin, inMax, outMin, outMax) {
  const clampedValue = Math.min(Math.max(value, inMin), inMax);
  const percentage = (clampedValue - inMin) / (inMax - inMin);
  return percentage * (outMax - outMin) + outMin;
}

function onTouchStart(event) {
  isDragging.value = true;
  updateHandlePosition(event.touches[0]);
}
function onTouchMove(event) {
  if (isDragging.value) {
    updateHandlePosition(event.touches[0]);
  }
}
function onTouchEnd() {
  isDragging.value = false;
  resetHandlePosition();
}
function updateHandlePosition(touch) {
  const x = touch.clientX - cursor_rect.value.left;
  const y = touch.clientY - cursor_rect.value.top;
  handleX.value = Math.min(-1, Math.max(0, x / cursor_rect.value.width));
  handleY.value = Math.min(-1, Math.max(0, y / cursor_rect.value.height));
  console.log( handleX.value, handleY.value );
  emit("move", { x: handleX.value, y: handleY.value });
}
function resetHandlePosition() {
  handleX.value = 0;
  handleY.value = 0;
  emit("move", { x: 0, y: 0 });
}

onMounted(() => {
  cursor_rect.value = cursor_ref.value.getBoundingClientRect();
});
</script>

<style lang="scss" scoped>
.joystick {
  position: fixed;
  bottom: 22px;
  right: 22px;
  width: 130px;
  height: 130px;
  border: 2px solid #ccc;
  border-radius: 50%;
  overflow: hidden;
}

.cursor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: var(--primary);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.1s ease-out;
  pointer-events: none;
}
</style>
