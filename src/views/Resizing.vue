<template>
  <canvas ref="canvas_ref" />
  <div class="top-right">
    <p>Double click to toggle full screen mode</p><br>
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ==============
// Variables
// ==============
const FOV = 75;
const show_wireframe = true;

const canvas_ref   = ref(undefined);
const sizes        = reactive({ width: window.innerWidth, height: window.innerHeight });
const aspect_ratio = computed(() => sizes.width / sizes.height );

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Controls
let controls;

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "brown", wireframe: show_wireframe });
const mesh     = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ==============
// Functions
// ==============
function updateScene() {
  controls.update();
}

function gameLoop() {
  updateScene();
  renderer.render(scene, camera);
  window.requestAnimationFrame( gameLoop );
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ));
}

function onDblclick() {
  // (!) may not work on Safari
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if ( fullscreenElement ){
    if ( document.exitFullscreen ){
      document.exitFullscreen();
    } else if( document.webkitExitFullscreen ){
      document.webkitExitFullscreen();
    }
    return;
  }

  if( canvas_ref.value.requestFullscreen ) {
    canvas_ref.value.requestFullscreen();
  } else if( canvas_ref.value.webkitRequestFullscreen ){
    canvas_ref.value.webkitRequestFullscreen();
  }
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('dblclick', onDblclick);
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); 
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 )); // optimize pixel ratio (not over 2)

  camera.position.z = 3;
  
  controls = new OrbitControls( camera, canvas_ref.value );
  controls.enableDamping = true;

  gameLoop();
});

</script>

<style lang="scss" scoped>
.top-right {
  position: fixed;
  top: 22px;
  right: 22px;
  color: var(--light-color);
  user-select: none;
}
</style>
