<template>
  <canvas ref="canvas_ref" />
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


// ==============
// Variables
// ==============
const canvas_ref = ref( undefined );
const fov = 75; // field of view (degree) in vertical
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspect_ratio = sizes.width / sizes.height;

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'brown', wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect_ratio);
scene.add(camera);


// ==============
// Life cycle
// ==============
onMounted(() => {
  camera.position.z = 3; // by default the camera is at the center of the scena, we need to move it in order to see something
  const renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); // append the canvas DOMobj to the renderer
  renderer.setSize( sizes.width, sizes.height );
  renderer.render( scene, camera );
});



</script>