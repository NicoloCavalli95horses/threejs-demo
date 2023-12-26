<template>
  <canvas ref="canvas_ref" />
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ==============
// Variables
// ==============
const FOV = 75;
const show_wireframe = true;
let animation_frame = undefined;

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

// Set material
const material = new THREE.MeshBasicMaterial({ color: "#222", wireframe: show_wireframe });

// float 32 array: array of fixed length that can store only floats. Easier to handle for matrix calculations
const positionsArray = new Float32Array(9); // length

/**
 * Let's create an array that stores the vertices of a triangle 
*/

// first vertex
positionsArray[0] = 0; // x
positionsArray[1] = 0; // y
positionsArray[2] = 0; // z

// second vertex
positionsArray[3] = 0; // x
positionsArray[4] = 1; // y
positionsArray[5] = 0; // z

// third vertex
positionsArray[6] = 1; // x
positionsArray[7] = 1; // y
positionsArray[8] = 0; // z

/**
 * another way is to send the values directly with new Float32Array([
 *   0, 0, 0,
 *   0, 1, 0,
 *   1, 0, 0
 * ])
 */

// convert the Float32rray to a BufferAttribute
const positionsAttribute = new THREE.BufferAttribute( positionsArray, 3 );

// send the buffer to the geometry
const custom_geometry = new THREE.BufferGeometry();
custom_geometry.setAttribute('position', positionsAttribute); // 'position' is the name used by the shaders

// const mesh = new THREE.Mesh(custom_geometry, material);
// scene.add(mesh);

/**
 * Focus on the box geometry
*/

const box_sizes = {
  // size on xyz axes 
  width: 1,
  height: 1,
  depth: 4,
}

const segments = {
  // how many triangles per face 
  width: 1,
  height: 1,
  depth: 4,
}

const box_geometry = new THREE.BoxGeometry(
  box_sizes.width,
  box_sizes.height,
  box_sizes.depth,
  segments.width,
  segments.height,
  segments.depth
);

// const mesh = new THREE.Mesh(box_geometry, material);
// scene.add(mesh);


/**
 * Render a cool torus instead
*/
const torus = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
const mesh = new THREE.Mesh(torus, material);
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
  animation_frame = window.requestAnimationFrame( gameLoop );
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

  camera.position.z = 20;
  
  controls = new OrbitControls( camera, canvas_ref.value );
  controls.enableDamping = true;

  gameLoop();
});


onUnmounted(() => {
  cancelAnimationFrame( animation_frame );
});

</script>

<style lang="scss" scoped>
</style>
