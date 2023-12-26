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
import GUI from 'lil-gui';

// ==============
// Variables
// ==============
const FOV = 75;
const show_wireframe = true;

const canvas_ref   = ref(undefined);
const sizes        = reactive({ width: window.innerWidth, height: window.innerHeight });
const aspect_ratio = computed(() => sizes.width / sizes.height );
let animation_frame = undefined;

// GUI debug panel
const gui = new GUI({
  // custom debug UI styling
  width: 250,
  title: 'my debug UI',
  closeFolders: false, // close all by default or not
});

const debugObj = {
  color: '#269c6f',
  subdivisions: 5,
  test_function: () => {
    console.log('a test function is called');
  }
};

// folders
const cube_folder = gui.addFolder('awesome cube'); //sub-folders are also supported

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Controls
let controls;

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// Set material
const material = new THREE.MeshBasicMaterial({ color: debugObj.color, wireframe: show_wireframe });

// Set object
const box = new THREE.BoxGeometry( 1, 1, 1, debugObj.subdivisions, debugObj.subdivisions, debugObj.subdivisions );
const mesh = new THREE.Mesh(box, material);
scene.add(mesh);

/**
 * GUI LIBRARY
 * Gui is a very popular library for manipulating Three.js objects.
 * With the simple method .add() we can render a little panel from which we can play with 
 * different properties of Three.js objects.
 * 
 * Based on the numbers of parameters we provide, GUI will understand what kind of debug tool we need  
*/

const min_val = -3;
const max_val = 3;
const step = 0.01;
// gui.add(mesh.position, 'y', min_val, max_val, step);

// functions chaining is also supported:
cube_folder.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y pos');
cube_folder.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x pos');
cube_folder.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('z pos');

// checkbox
cube_folder.add(mesh,'visible'); 
cube_folder.add(material,'wireframe'); 

// color picker
// note that Three.js applies some color management in order to optimise the rendering
// the color value that is being displayed in the tweak isn't the same value as the one being used internally
// To handle this problem, let's give to gui.addColor a debug color to change, then use that color to set
// a new material color internally
cube_folder.addColor(debugObj, 'color').onChange(() => material.color.set( debugObj.color ));

// buttons and functions
cube_folder.add(debugObj, 'test_function');

// in order to update the whole geometry we actually need to destroy the object and render a new one each time
// this is just for educational purposes and it is not recommended for performance issues
cube_folder.add(debugObj, 'subdivisions').min(1).max(20).step(1).onChange(() => {
  mesh.geometry.dispose(); // remove the last one that is cached
  mesh.geometry = new THREE.BoxGeometry( 1, 1, 1, debugObj.subdivisions, debugObj.subdivisions, debugObj.subdivisions);
});

// cube_folder.close() // close the folder

// toggle the debug GUI
// gui.hide(); // will not remove it from the DOM

// ==============
// Functions
// ==============
function onKeyDown( ev ) {
  if ( ev.key == 'd' ) {
    // gui._hidden retuns a boolean, so we can use the current state to toggle the panel
    gui.show( gui._hidden );
  }
}

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
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize);
  window.addEventListener('dblclick', onDblclick);
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); 
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 )); // optimize pixel ratio (not over 2)
  
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
  
  controls = new OrbitControls( camera, canvas_ref.value );
  controls.enableDamping = true;
  
  gameLoop();
});

onUnmounted(() => {
  gui.hide();
  cancelAnimationFrame( animation_frame );
});

</script>

<style lang="scss" scoped>
</style>
