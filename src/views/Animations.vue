<template>
  <canvas ref="canvas_ref" />
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, onMounted } from "vue";
import * as THREE from "three";

// ==============
// Variables
// ==============
const canvas_ref = ref(undefined);
const fov = 75;
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspect_ratio = sizes.width / sizes.height;
const show_wireframe = true;

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "brown",
  wireframe: show_wireframe,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect_ratio);
scene.add(camera);

// Clock
const clock = new THREE.Clock();

// ==============
// Functions
// ==============
function gameLoop() {
  updateObject(); // update mesh
  renderer.render(scene, camera); // call rendered
  window.requestAnimationFrame( gameLoop ); // default: 60 FPS
}

function updateObject() {
  // animate the scene always at the same speed, regardless of the FPS of the PC
  const elapsed = clock.getElapsedTime();

  // move the mesh
  mesh.position.y = Math.sin( elapsed );
  mesh.position.x = Math.cos( elapsed );
  
  // move the camera
  // camera.position.y = Math.sin( elapsed );
  // camera.position.x = Math.cos( elapsed );
  // camera.lookAt( mesh.position );
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); 
  renderer.setSize(sizes.width, sizes.height);
  camera.position.z = 3;
  gameLoop()  
});
</script>
