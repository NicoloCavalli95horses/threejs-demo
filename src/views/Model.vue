<template>
  <canvas ref="canvas_ref" />
  <!-- <Joystick /> -->
  <div class="keys">
    <div />
    <div class="key" @pointerup="onKeyup" @pointerdown="up">↑</div>
    <div />
    <div class="key" @pointerup="onKeyup" @pointerdown="left">←</div>
    <div />
    <div class="key" @pointerup="onKeyup" @pointerdown="right">→</div>
    <div />
    <div class="key" @pointerup="onKeyup" @pointerdown="down">↓</div>
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
// import Joystick from "../components/Joystick.vue";

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
const aspect_ratio = computed(() => sizes.width / sizes.height);
const spider_model_url = "/models/spider.glb";
const assetLoader = new GLTFLoader();
const gui = new GUI();

let mixer = undefined;
let animation_frame = undefined;
let model = undefined;
let spider_default_animation = undefined;
let spider_walk_animation = undefined;
let timeout = undefined;

const scene = new THREE.Scene();
let renderer = null;
let clock = new THREE.Clock();
let controls;
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
  model = ev.scene;
  model.position.y = -0.5;
  model.position.z = 1;
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

function onKeyup() {
  clearTimeout( timeout );
  timeout = undefined;
  spider_walk_animation.stop();
  spider_default_animation.play();
}

function up() {
  spider_walk_animation.play();
  spider_default_animation.stop();
  model.position.z += SPEED;
  timeout = setTimeout( up, 100 );
}
function down() {
  spider_walk_animation.play();
  spider_default_animation.stop();
  model.position.z -= SPEED;
  timeout = setTimeout( down, 100 );

}

function left() {
  spider_walk_animation.play();
  spider_default_animation.stop();
  model.position.x += SPEED;
  timeout = setTimeout( left, 100 );
}

function right() {
  spider_walk_animation.play();
  spider_default_animation.stop();
  model.position.x -= SPEED;
  timeout = setTimeout( right, 100 );
}

function onKeydown(e) {
  if (!["a", "d", "w", "s"].includes(e.key)) {
    return;
  }
  spider_walk_animation.play();
  spider_default_animation.stop();
  switch (e.key) {
    case "a":
      model.position.x += SPEED;
      break;
    case "d":
      model.position.x -= SPEED;
      break;
    case "w":
      model.position.z += SPEED;
      break;
    case "s":
      model.position.z -= SPEED;
      break;
  }
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("resize", onResize);
  window.addEventListener("dblclick", onDblclick);
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("keyup", onKeyup);
  assetLoader.load(spider_model_url, onLoadAsset);
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  camera.position.z = 3;
  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;
  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animation_frame);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("dblclick", onDblclick);
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("keyup", onKeyup);
  gui.hide();
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
  .key {
    display: grid;
    place-content: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid #eee;
    color: #eee;
  }
}
</style>
