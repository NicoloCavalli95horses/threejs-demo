<template>
  <canvas ref="canvas_ref" />
  <LoadingSpinner v-if="is_loading" />
  
  <div class="keys">
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'up' }" @pointerup="onKeyup" @pointerdown="move('up')">↑</div>
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'left' }" @pointerup="onKeyup" @pointerdown="move('left')">←</div>
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'right' }" @pointerup="onKeyup" @pointerdown="move('right')">→</div>
    <div />
    <div class="key" :class="{ 'active' : pointer_down == 'down' }" @pointerup="onKeyup" @pointerdown="move('down')">↓</div>
    <div />
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import LoadingSpinner from "../components/LoadingSpinner.vue";

// ==============
// Variables
// ==============
const FOV = 75;
const SPEED = 0.03;
const canvas_ref = ref(undefined);
const sizes = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});
const is_loading = ref( true );
const pointer_down = ref( false );
const aspect_ratio = computed(() => sizes.width / sizes.height);
const spider_model_url = "/models/spider.glb";
const assetLoader = new GLTFLoader();
// const gui = new GUI();

let mixer = undefined;
let animation_frame = undefined;
let model = undefined;
let spider_default_animation = undefined;
let spider_walk_animation = undefined;
let timeout = undefined;
let renderer = null;
let controls;

const scene = new THREE.Scene();
let clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;

scene.add(directionalLight);

// plane
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);

// ==============
// Functions
// ==============
function onLoadAsset(ev) {
  is_loading.value = false;
  model = ev.scene;
  model.position.y = -0.5;
  model.position.z = -0.5;
  mixer = new THREE.AnimationMixer(model);
  spider_walk_animation = mixer.clipAction(
    ev.animations.find((a) => a.name == "spider.walk")
  );
  spider_default_animation = mixer.clipAction(
    ev.animations.find((a) => a.name == "spider.default")
  );
  spider_default_animation.play();
  scene.add(model);
}

function updateScene() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  controls.update();
  renderer.render(scene, camera);
}

function gameLoop() {
  updateScene();
  animation_frame = window.requestAnimationFrame(gameLoop);
}

function onResize() {
  console.log( camera.position )
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

function onKeyup() {
  clearTimeout( timeout );
  timeout = undefined;
  spider_walk_animation.stop();
  spider_default_animation.play();
  pointer_down.value = false;
}

function move(direction) {
  spider_walk_animation.play();
  spider_default_animation.stop();
  pointer_down.value = direction;

  switch (direction) {
    case 'up':
      model.position.z += SPEED;
      break;
    case 'down':
      model.position.z -= SPEED;
      break;
    case 'left':
      model.position.x += SPEED;
      break;
    case 'right':
      model.position.x -= SPEED;
      break;
    default:
      break;
  }

  timeout = setTimeout(() => move(direction), 100);
}



// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("resize", onResize);
  window.addEventListener("keyup", onKeyup);
  assetLoader.load(spider_model_url, onLoadAsset);
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  camera.position.z = -2;
  camera.position.y = 2;
  camera.position.x = 0;
  
  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;
  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animation_frame);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("keyup", onKeyup);
  // gui.hide();
  clearTimeout( timeout );
  timeout = undefined;
});
</script>

<style lang="scss" scoped>
.keys {
  position: fixed;
  bottom: 22px;
  right: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  .key {
    display: grid;
    place-content: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid #eee;
    transition-duration: 400ms;
    color: #eee;
    &.active {
      background-color: #eee;
      color: #222;
      transition-duration: 400ms;
      transform: scale(0.9);
    }
  }
}
</style>
