<template>
  <canvas ref="canvas_ref" />

  <!-- move camera -->
  <KeyBoard :step="0.2" :keys="cameraKeys" @change-x="onMoveCameraX" @change-y="onMoveCameraY" @change-z="onMoveCameraZ" />

  <!-- edit mesh -->
  <KeyBoard :step="0.2" :keys="meshScaleKeys" @change-x="onScaleMeshX" @change-y="onScaleMeshY" @change-z="onScaleMeshZ" />
  
  <!-- rotate mesh -->
  <KeyBoard :step="0.2" :keys="meshRotateKeys" @change-x="onRotateMeshX" @change-y="onRotateMeshY" @change-z="onRotateMeshZ" />
</template>

<script setup>
// ==============
// Import
// ==============
import { 
  ref,
  onMounted,
} from 'vue';

import * as THREE from 'three';
import KeyBoard from './components/KeyBoard.vue';


// ==============
// Variables
// ==============
const canvas_ref = ref( undefined );
const fov = 75; // field of view (degree) in vertical
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspect_ratio = sizes.width / sizes.height;
const show_wireframe = true;
const cameraKeys = {
  x: {
    plus: 'ArrowRight',
    minus: 'ArrowLeft',
  },
  y: {
    plus: 'ArrowUp',
    minus: 'ArrowDown',
  },
  z: {
    plus: 'Period',
    minus: 'Slash'
  }
}

const meshScaleKeys = {
  x: {
    plus: 'KeyD',
    minus: 'KeyA',
  },
  y: {
    plus: 'KeyW',
    minus: 'KeyS',
  },
  z: {
    plus: 'KeyZ',
    minus: 'KeyX'
  }
}
const meshRotateKeys = {
  x: {
    plus: 'KeyH',
    minus: 'KeyF',
  },
  y: {
    plus: 'KeyT',
    minus: 'KeyG',
  },
  z: {
    plus: 'KeyV',
    minus: 'KeyB'
  }
}

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Axes helper
const axesLength = 2;
const axesHelper = new THREE.AxesHelper( axesLength );
scene.add(axesHelper);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'brown', wireframe: show_wireframe });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect_ratio);
scene.add(camera);

// ==============
// Functions
// ==============
function onMoveCameraX(i){
  camera.position.x += i;
  renderer.render( scene, camera );
}
function onMoveCameraY(i){
  camera.position.y += i;
  renderer.render( scene, camera );
}
function onMoveCameraZ(i){
  camera.position.z += i;
  renderer.render( scene, camera );
}
function onScaleMeshX(i){
  mesh.scale.x += i;
  renderer.render( scene, camera );
}
function onScaleMeshY(i){
  mesh.scale.y += i;
  renderer.render( scene, camera );
}
function onScaleMeshZ(i){
  mesh.scale.z += i;
  renderer.render( scene, camera );
}
function onRotateMeshX(i){
  mesh.rotation.x += i;
  renderer.render( scene, camera );
}
function onRotateMeshY(i){
  mesh.rotation.y += i;
  renderer.render( scene, camera );
}
function onRotateMeshZ(i){
  mesh.rotation.z += i;
  renderer.render( scene, camera );
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  camera.position.z = 3; // by default the camera is at the center of the scena, we need to move it in order to see something
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); // append the canvas DOMobj to the renderer
  renderer.setSize( sizes.width, sizes.height );
  renderer.render( scene, camera );
});


</script>