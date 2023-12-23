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
import GUI from 'lil-gui';

// ==============
// Variables
// ==============
const FOV = 75;
const gui = new GUI();

const canvas_ref = ref(undefined);
const sizes = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});
const aspect_ratio = computed(() => sizes.width / sizes.height);

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// Controls
let controls;

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// (!) Lights effects are computionally expensive: use as less lights as possible
// Moderate cost:
// - directional light
// - point light

// High cost
// - spotlight
// -rectarea light

// You can avoid using light by backing the light into the texture of the 3D object (using Blender or other software)

/**
 * Ambient light
*/
//  applied in every direction. The output is uniform
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
// gui.add(ambientLight, 'intensity').min(0).max(3).step(0.01);
// scene.add(ambientLight);

/**
 * Directional light
*/
// the light 'rays' comes from the same direction. It creates shadows on curved surfaces
// const directionalLight = new THREE.DirectionalLight(0x00ffc, 3);
// directionalLight.position.set(1, 0.25, 0);// change light position (x, y, z)
// gui.add(directionalLight, 'intensity').min(0).max(3).step(0.01);
// scene.add(directionalLight);

/**
 * Hemisphere light
 * create two lights that are applied from the top and from the bottom
 * as the ambient light, hemisphere lights illuminate everywhere
*/
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
// hemisphereLight.position.set(1, 0.25, 0);// change light position (x, y, z)
// gui.add(hemisphereLight, 'intensity').min(0).max(3).step(0.01);
// scene.add(hemisphereLight);


/**
 * Point light
 * by default, the point is infinitly small
 * move the point to illuminate specific points in the space
*/
// const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 1); //color, intensity, distance, decay
// pointLight.position.set(1, -0.5, 1);
// gui.add(pointLight, 'distance');
// gui.add(pointLight, 'decay');
// gui.add(pointLight.position, 'x');
// gui.add(pointLight.position, 'y');
// gui.add(pointLight.position, 'z');
// scene.add(pointLight);


/**
 * Rect area light
 * create a cool rectangular area emitting light
 */
const rectLight = new THREE.RectAreaLight('#008', 10, 1, 3);
rectLight.position.z = 1;
gui.add(rectLight, 'intensity').min(0).max(6).step(0.1);
gui.add(rectLight, 'width').min(0).max(5).step(0.1);
gui.add(rectLight, 'height').min(0).max(5).step(0.1);
gui.add(rectLight.position, 'x');
gui.add(rectLight.position, 'y');
gui.add(rectLight.position, 'z');
scene.add(rectLight);

/**
 * Spot light
 * a flash light that illuminate a circle
 */
// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI*0.1, 0.25, 1);
// spotLight.target.position.x = -0.7 
// gui.add(spotLight.position, 'x');
// gui.add(spotLight.position, 'y');
// gui.add(spotLight.position, 'z');
// scene.add(spotLight, spotLight.target); //add the target to the scene if you change its position

// to assist us with positioning the lights we can use helpers
// - HemisphereLightHelper
// - DirectionalLightHelper
// - PointLightHelper
// - RectAreaLightHelper
// - SpotLightHelper

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

// ==============
// Functions
// ==============
function updateScene() {
  controls.update();
}

function gameLoop() {
  updateScene();
  renderer.render(scene, camera);
  window.requestAnimationFrame(gameLoop);
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

  camera.position.z = 3;

  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;

  gameLoop();
});

onUnmounted(() => gui.hide());

</script>

<style lang="scss" scoped></style>
