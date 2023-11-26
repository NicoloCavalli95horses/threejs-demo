<template>
  <canvas ref="canvas_ref" />

  <!-- move camera -->
  <KeyBoardXYZ
    :step="0.2"
    :keys="keys.camera"
    @x="onMoveCameraX"
    @y="onMoveCameraY"
    @z="onMoveCameraZ"
  />

  <!-- scale mesh -->
  <KeyBoardXYZ
    :step="0.2"
    :keys="keys.meshScale"
    @x="onScaleMeshX"
    @y="onScaleMeshY"
    @z="onScaleMeshZ"
  />

  <!-- rotate mesh -->
  <KeyBoardXYZ
    :step="0.2"
    :keys="keys.meshRotate"
    @x="onRotateMeshX"
    @y="onRotateMeshY"
    @z="onRotateMeshZ"
  />

  <div class="keys-wrapper">
    <h4>Camera</h4>
    <p>Move x <code>{{ keys.camera.x.minus }}, {{ keys.camera.x.plus }}</code></p>
    <p>Move y <code>{{ keys.camera.y.minus }}, {{ keys.camera.y.plus }}</code></p>
    <p>Move z <code>{{ keys.camera.z.minus }}, {{ keys.camera.z.plus }}</code></p>
    <h4>Mesh scale</h4>
    <p>Scale x <code>{{ keys.meshScale.x.minus }}, {{ keys.meshScale.x.plus }}</code></p>
    <p>Scale y <code>{{ keys.meshScale.y.minus }}, {{ keys.meshScale.y.plus }}</code></p>
    <p>Scale z <code>{{ keys.meshScale.z.minus }}, {{ keys.meshScale.z.plus }}</code></p>
    <h4>Mesh rotate</h4>
    <p>Rotate x <code>{{ keys.meshRotate.x.minus }}, {{ keys.meshRotate.x.plus }}</code></p>
    <p>Rotate y <code>{{ keys.meshRotate.y.minus }}, {{ keys.meshRotate.y.plus }}</code></p>
    <p>Rotate z <code>{{ keys.meshRotate.z.minus }}, {{ keys.meshRotate.z.plus }}</code></p>
  </div>
</template>

<script setup>
// ==============
// Import
// ==============
import { 
  ref,
  onMounted
} from "vue";
import * as THREE from "three";
import { keys } from '../keys.mjs';
import KeyBoardXYZ from "../components/KeyBoardXYZ.vue";

// ==============
// Variables
// ==============
const canvas_ref = ref(undefined);
const fov = 75; // field of view (degree) in vertical
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspect_ratio = sizes.width / sizes.height;
const show_wireframe = true;

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Axes helper
const axesLength = 2;
const axesHelper = new THREE.AxesHelper(axesLength);
scene.add(axesHelper);

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

// ==============
// Functions
// ==============
function onMoveCameraX(i) {
  camera.position.x += i;
  renderer.render(scene, camera);
}
function onMoveCameraY(i) {
  camera.position.y += i;
  renderer.render(scene, camera);
}
function onMoveCameraZ(i) {
  camera.position.z += i;
  renderer.render(scene, camera);
}
function onScaleMeshX(i) {
  mesh.scale.x += i;
  renderer.render(scene, camera);
}
function onScaleMeshY(i) {
  mesh.scale.y += i;
  renderer.render(scene, camera);
}
function onScaleMeshZ(i) {
  mesh.scale.z += i;
  renderer.render(scene, camera);
}
function onRotateMeshX(i) {
  mesh.rotation.x += i;
  renderer.render(scene, camera);
}
function onRotateMeshY(i) {
  mesh.rotation.y += i;
  renderer.render(scene, camera);
}
function onRotateMeshZ(i) {
  mesh.rotation.z += i;
  renderer.render(scene, camera);
}

// ==============
// Life cycle
// ==============
onMounted(() => {
  camera.position.z = 3; // by default the camera is at the center of the scena, we need to move it in order to see something
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value }); // append the canvas DOMobj to the renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
});
</script>


<style lang="scss" scoped>
.keys-wrapper {
  position: fixed;
  bottom: 22px;
  right: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 70vh;
  .key, code {
    border: 1px solid rgb(255, 255, 255, 0.4);
  }
}
</style>