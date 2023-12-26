<template>
  <canvas ref="canvas_ref" />
  <LoadingSpinner v-if="is_loading" />
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// ==============
// Variables
// ==============
// const gui = new GUI();

const FOV = 75;
let animation_frame = undefined;

const canvas_ref = ref(undefined);
const sizes = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});
const aspect_ratio = computed(() => sizes.width / sizes.height);
const is_loading = ref( true );

// font loader
const fontLoader = new FontLoader();
fontLoader.load('/font/helvetiker_regular.typeface.json', (f) => {
  is_loading.value = false;
  const bevelSize = 0.02; 
  const bevelThickness = 0.03;

  const textGeometry = new TextGeometry('Lorem ipsum', {
    font: f,
    size: 0.5,
    height: 0.2,
    curveSegments: 5, //lower this for better performance
    bevelEnabled: true,
    bevelThickness: bevelThickness, // border depth (z axis)
    bevelSize: bevelSize, // border of the text
    bevelOffset: 0,
    bevelSegments: 3, // lower this for better performance
  });
  textGeometry.computeBoundingBox(); // tell THREE.js to calculate font bounding box, that are coordiantes of the 3D geometry
  // we can center the text by moving the geometry instead of the mesh
  textGeometry.translate(
    - (textGeometry.boundingBox.max.x - bevelSize ) / 2,
    - (textGeometry.boundingBox.max.y - bevelSize ) / 2,
    - (textGeometry.boundingBox.max.z - bevelThickness ) / 2,
  )

  const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
  // console.log( textGeometry.boundingBox) // check if text is centered

  // we can center the text using directly
  // textGeometry.center();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ wireframe: true });
  
  for (let i = 0; i< 100; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5 ) * 10;
    mesh.position.y = (Math.random() - 0.5 ) * 10;
    mesh.position.z = (Math.random() - 0.5 ) * 10;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.material.color = new THREE.Color( `hsla(${Math.random() * 360}, 100%, 50%, 1)` );
    const rand = Math.random();
    mesh.scale.set( rand, rand, rand );
    scene.add(mesh);
  }
});

// Scene
const scene = new THREE.Scene();

// Axes
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// Renderer
let renderer = null;

// Controls
let controls;

// Clock
const clock = new THREE.Clock();

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// ==============
// Functions
// ==============
function updateScene() {
  controls.update();
  const elapsedTime = clock.getElapsedTime();
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

  camera.position.z = 6;

  controls = new OrbitControls(camera, canvas_ref.value);
  controls.enableDamping = true;

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame( animation_frame );
});

</script>

<style lang="scss" scoped></style>
