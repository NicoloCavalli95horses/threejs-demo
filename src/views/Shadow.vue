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
import GUI from "lil-gui";

// ==============
// Variables
// ==============
const FOV = 75;
const gui = new GUI();
let animation_frame = undefined;

const canvas_ref = ref(undefined);
const sizes = reactive({ width: window.innerWidth, height: window.innerHeight });
const aspect_ratio = computed(() => sizes.width / sizes.height);

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Controls
let controls;

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
scene.add(ambientLight);

/**
 * Shadows are just supported by: PointLight, DirectionalLight, SpotLight
 * Shadows will automatically follows the object as it is moved or animated
 */


// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, - 1);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001);
directionalLight.castShadow = true; // can emit shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;


directionalLight.shadow.top = 2;
directionalLight.shadow.right = 2;
directionalLight.shadow.bottom = -2;
directionalLight.shadow.left = -2;

directionalLight.shadow.camera.near = 2; // adjust camera position
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.radius = 6;


const directionalCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalCameraHelper.visible = false;
scene.add(directionalLight, directionalCameraHelper);


// spotlight
//const spotlight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
//spotlight.castShadow = true;
//spotlight.position.set(0, 2, 2);
//spotlight.shadow.mapSize.width = 1024;
//spotlight.shadow.mapSize.height = 1024;
//spotlight.shadow.camera.fov = 30;
//spotlight.shadow.camera.near = 2;
//spotlight.shadow.camera.far = 6;
//
//const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);
//spotlightCameraHelper.visible = false;
//
//scene.add(spotlight, spotlight.target, spotlightCameraHelper);

// Pointlight
// const pointLight = new THREE.PointLight(0xffffff, 2.7);
// pointLight.castShadow = true;
// pointLight.position.set(-1, 1, 0);
// pointLight.shadow.mapSize.width = 1024;
// pointLight.shadow.mapSize.height = 1024;

// pointLight.shadow.camera.near = 0.1;
// pointLight.shadow.camera.far = 5;
// scene.add(pointLight);

// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// pointLightCameraHelper.visible = false;
// scene.add(pointLightCameraHelper);

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true; // can emit shadows

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true; //can receive shadows from other objects

scene.add(sphere, plane);

// a commons solution is to avoid shadows as much as possible and to using baked-shadows (that is, textures with rasted shadows);

// ==============
// Functions
// ==============
function updateScene() {
  controls.update();
}

function gameLoop() {
  updateScene();
  renderer.render(scene, camera);
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
  // (!) may not work on Safari
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
  renderer = new THREE.WebGLRenderer({ canvas: canvas_ref.value });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize pixel ratio (not over 2)
  renderer.shadowMap.enabled = true;

  camera.position.z = 3;

  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;

  gameLoop();
});

onUnmounted(() => {
  gui.hide();
  cancelAnimationFrame( animation_frame );
});

</script>

<style lang="scss" scoped></style>
