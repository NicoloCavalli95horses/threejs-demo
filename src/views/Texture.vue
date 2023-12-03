<template>
  <canvas ref="canvas_ref" />
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
const show_wireframe = false;
const BASE_URL = '/textures/';
const SRC_ALPHA_DOOR     = BASE_URL + 'alpha.jpg';
const SRC_AMBIENT_DOOR   = BASE_URL + 'ambient.jpg';
const SRC_COLOR_DOOR     = BASE_URL + 'door.jpeg';
const SRC_HEIGHT_DOOR    = BASE_URL + 'height.png';
const SRC_METALNESS_DOOR = BASE_URL + 'metalness.jpg';
const SRC_NORMAL_DOOR    = BASE_URL + 'normal.jpg'; // it is usually png
const SRC_ROUGHNESS_DOOR = BASE_URL + 'roughness.jpg';

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

/**
 * LOAD A TEXTURE MANUALLY
 * 
  // Set texture
  const image = new Image();
  image.SRC_COLOR_DOOR = SRC_COLOR_DOOR;
  const texture = new THREE.Texture( image );

  image.onload = function() {
    // update texture as image is loaded
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
  };
*/

/** LOAD A TEXTURE WITH TextureLoader
 * - optimized solution
 * - we can load more texture at the same time
 * - three states are supported as parameter: load, progress, error
*/
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(SRC_COLOR_DOOR, onProgress, onError);  //progress and error of the single texture
// texture.colorSpace = THREE.SRGBColorSpace;


/**
 * LoadingManager: handle multiple loadings 
*/

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function() {
  // will run once at the very start
  console.log('start loading');
}
loadingManager.onProgress = function() {
  // will run for each texture in progress
  console.log('progress loading');
}
loadingManager.onLoad = function() {
  // will run once at the very end
  console.log('loaded');
}
loadingManager.onError = function() {
  // will run for eacth texture in case of error
  console.error('loading error');
}

const textureLoader = new THREE.TextureLoader(loadingManager);

// colored texture
const colorTexture = textureLoader.load(SRC_COLOR_DOOR);
colorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Transforming a texture
*/
// repeat
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 2;
// colorTexture.wrapS = THREE.RepeatWrapping; // repeat the texture in x
// colorTexture.wrapT = THREE.RepeatWrapping; // repeat the texture in y

// set offset
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// rotation (0 = start position, pi/2 = 45° rotation, pi = 90°, etc)
// colorTexture.rotation = Math.PI;
// colorTexture.center.x = 0.5; // by default the pivot point is in the bottom left corner
// colorTexture.center.y = 0.5;

// alpha texture
const alphaTexture = textureLoader.load(SRC_ALPHA_DOOR);
alphaTexture.colorSpace = THREE.SRGBColorSpace;

// height texture
const heightTexture = textureLoader.load(SRC_HEIGHT_DOOR);
heightTexture.colorSpace = THREE.SRGBColorSpace;

// ambient texture
const ambientTexture = textureLoader.load(SRC_AMBIENT_DOOR);
ambientTexture.colorSpace = THREE.SRGBColorSpace;

// normal texture
const normalTexture = textureLoader.load(SRC_NORMAL_DOOR);
normalTexture.colorSpace = THREE.SRGBColorSpace;

// metalness texture
const metalnessTexture = textureLoader.load(SRC_METALNESS_DOOR);
metalnessTexture.colorSpace = THREE.SRGBColorSpace;

// roughness texture
const roughnessTexture = textureLoader.load(SRC_ROUGHNESS_DOOR);
roughnessTexture.colorSpace = THREE.SRGBColorSpace;

// Set material
const material = new THREE.MeshBasicMaterial({ 
  map: colorTexture,
  wireframe: show_wireframe
});

// Set object
const box = new THREE.BoxGeometry( 15, 15, 1 );
// console.log( box.attributes ); // contains uv information
const mesh = new THREE.Mesh(box, material);
scene.add(mesh);

// ==============
// Functions
// ==============
// function onProgress(ev) {
//   console.log('texture is loading', ev);
// }

// function onError(ev) {
//   console.error('error while loading a texture', ev);
// }

function updateScene() {
  controls.update();
}

function gameLoop() {
  updateScene();
  renderer.render(scene, camera);
  window.requestAnimationFrame( gameLoop );
}

function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = aspect_ratio.value;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ));
}

function onDblclick() {
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ));

  camera.position.z = 20;
  
  controls = new OrbitControls( camera, canvas_ref.value );
  controls.enableDamping = true;
  gameLoop();
});

</script>

<style lang="scss" scoped>
</style>
