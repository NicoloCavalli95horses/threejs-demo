<template>
  <canvas ref="canvas_ref" />
  <div class="abs-center"><h1>to do</h1></div>
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

// ==============
// Variables
// ==============
const FOV = 75;
const gui = new GUI();

const canvas_ref = ref(undefined);
const sizes = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});
const aspect_ratio = computed(() => sizes.width / sizes.height);

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Controls
let controls;

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);


scene.add(cube);

// ==============
// Functions
// ==============
function updateScene() {
  controls.update();
}

function gameLoop() {
  updateScene();
  renderer.render(scene, camera);
  window.requestAnimationFrame(gameLoop);
}

function onResize() {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = aspect_ratio.value;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onDblclick() {
  // (!) may not work on Safari
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    return;
  }

  if (canvas_ref.value.requestFullscreen) {
    canvas_ref.value.requestFullscreen();
  } else if (canvas_ref.value.webkitRequestFullscreen) {
    canvas_ref.value.webkitRequestFullscreen();
  }
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("resize", onResize);
  window.addEventListener("dblclick", onDblclick);
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize pixel ratio (not over 2)

  camera.position.z = 3;

  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;

  gameLoop();
});

onUnmounted(() => gui.hide());

</script>

<style lang="scss" scoped></style>
