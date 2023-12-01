<template>
  <canvas ref="canvas_ref" />
  <div class="top-right">
    <p>Zoom in and out with the mouse wheel</p><br>
    <p>Click and move the mouse to rotate the cube</p><br>
    <p>Shift and move the mouse to move the cube</p><br>
  </div>
  <div class="switch-btn">
    <SwitchBtn v-model:active="is_perspective">
      <p>{{ (is_perspective ? 'perspective' : 'ortogonal') + ' camera' }}</p>
    </SwitchBtn>
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, onMounted, computed, onUpdated } from "vue";
import * as THREE from "three";
import SwitchBtn from '../components/SwitchBtn.vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ==============
// Variables
// ==============
const canvas_ref = ref(undefined);
const fov = 75;
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspect_ratio = sizes.width / sizes.height;
const show_wireframe = true;
const is_perspective = ref( true );
const left = aspect_ratio*-1;
const right = aspect_ratio*1;
const top = 1;
const bottom = -1;

const camera = computed( () => {
  return is_perspective.value
    ? new THREE.PerspectiveCamera(fov, aspect_ratio)
    : new THREE.OrthographicCamera(left, right, top, bottom)
})

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Clock
const clock = new THREE.Clock();

// Controls
let controls;

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "brown",
  wireframe: show_wireframe,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ===================================
// About cameras
// ===================================
/**
 * Cameras types in Three.js:
 * - Camera: main class. Every other classes inherit from this one.
 * - ArrayCamera: used to render the scene from multiple cameras on specific areas of the render (examples: multiplayer games such as Mario Kart, in which you have a shared screen)
 * - StereoCamera: used to render the scene through two cameras that mimic the eyes to create a parallax effect. Used with devices like VR headset, red and blue glasses or cardboard
 * - CubeCamera: it does 6 renders at the same times, each one facing a different direction. Can render the surrounding for things like environment map, reflection or shadow map
 * - OrthographicCamera: render the scene without perspective (used for RPG games)
 * - PerspectiveCamera: render the scene with perspective
 */

// ==========================================
// new THREE.PerspectiveCamera() parameters
// ==========================================
/**
 * 1) fov (field of view): vertical vision angle. Goes from 0 to 180°. The greater the value, the greater the visible area and the distortions of the object in the scene.
 * 2) aspect ratio: the width of the render divided by the height of the render
 * 3) near: any object closest than this number will not be rendered
 * 4) far: any object further away than this number will not be rendered
 * 
 * Do not use extreme values like 0.0001 and 999999 to make everything captured by the camera.
 * This values will cause a z-fighting, meaning that the GPU won't be able to determine which object is over or under.
 * 
 * Commons values are between 0.1 and 100
 */

  // ==========================================
// new THREE.OrthographicCamera() parameters
// ==========================================
/**
 * Instead of a fov, we provide how far the camera can see in each direction
 * - left
 * - right
 * - top
 * - bottom
 * - near
 * - far
 */

// ==============
// Functions
// ==============
function gameLoop() {
  updateObject(); // update mesh
  renderer.render(scene, camera.value); // call rendered
  window.requestAnimationFrame( gameLoop ); // default: 60 FPS
}

function updateObject() {
  const elapsed = clock.getElapsedTime();
  controls.update(); // will make enableDamping work for each iteration
}


// ==============
// Life cycle
// ==============
onUpdated(() => {
  scene.add(camera.value);
  camera.value.position.z = 3;
  controls = new OrbitControls( camera.value, canvas_ref.value );
  controls.enableDamping = true;
  renderer.render(scene, camera.value);
})

onMounted(() => {
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); 
  renderer.setSize(sizes.width, sizes.height);
  camera.value.position.z = 3;
  controls = new OrbitControls( camera.value, canvas_ref.value );
  controls.enableDamping = true; // apply smoothness to mouse actions
  renderer.render(scene, camera.value);
  gameLoop();
});

</script>

<style lang="scss" scoped>
.switch-btn {
  position: fixed;
  top: 22px;
  left: 22px;
}

.top-right {
  position: fixed;
  top: 22px;
  right: 22px;
  color: var(--light-color);
}
</style>
