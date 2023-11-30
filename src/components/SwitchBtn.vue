<template>
    <div class="wrapper" :class="{ 'disabled': disabled }">
      <div class="dot-box" @click="onClick">
        <div class="dot" :class="{ 'active': active }" :style="{ 'left': active ? '50%' : '0%' }"></div>
      </div>
      <slot />
    </div>
  </template>
  
  <script setup>
  //===========================
  // Props
  //===========================
  const props = defineProps({
    active: Boolean,
    disabled: Boolean,
  });
  
  const emit = defineEmits([
    'update:active',
    'click',
  ]);
  
  
  //===========================
  // Functions
  //===========================
  function onClick() {
    emit('update:active', props.active ? false : true);
    emit('click');
  }
  
  
  </script>
  
  <style lang="scss" scoped>
  $w: 40px;
  $p: 5px;
  
  .wrapper {
    width: max-content;
    display: flex;
    align-items: center;
    margin: 8px;
    .dot-box {
      width: calc(2 * $w);
      height: $w;
      background-color: var(--background);
      border-radius: calc(2 * $w);
      position: relative;
      cursor: pointer;
      margin-right: 10px;
      .dot {
        position: absolute;
        top: 0%;
        height: calc(100% - ($p * 2));
        width: calc(50% - ($p * 2));
        margin: $p;
        background: #fff;
        border-radius: 50%;
        transition-duration: var(--transition-medium);
        &.active {
          background-color: var(--secondary);
        }
      }
    }
  }
  </style>