<template>
<canvas ref="canvas_ref" />
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ==============
// Variables
// ==============
const FOV = 75;

const canvas_ref = ref(undefined);
const sizes = reactive({ width: window.innerWidth, height: window.innerHeight });
const aspect_ratio = computed(() => sizes.width / sizes.height);
const spider_model_url = '/models/spider.glb';
let mixer = undefined;
let animation_frame = undefined;
let model = undefined;
const assetLoader = new GLTFLoader();

const scene = new THREE.Scene();
let renderer = null;
let clock = new THREE.Clock();
let controls;
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);


// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, - 1);
directionalLight.castShadow = true;

scene.add(directionalLight);

// ==============
// Functions
// ==============
function onLoadAsset(ev) {
  model = ev.scene;
  model.position.y = -0.5;
  model.position.z = 1;
  scene.add( model );
  mixer = new THREE.AnimationMixer( model );
  const clips = ev.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'spider.walk');
  const action = mixer.clipAction(clip);
  action.play();
}

function updateScene() {
  if ( mixer ) {
    mixer.update( clock.getDelta() );
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

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("resize", onResize);
  window.addEventListener("dblclick", onDblclick);
  assetLoader.load( spider_model_url, onLoadAsset);
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
  cancelAnimationFrame( animation_frame );
})
</script>

<style lang="scss" scoped></style>
