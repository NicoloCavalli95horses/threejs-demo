<template>
  <canvas ref="canvas_ref" />
  <div class="abs-center"><h2>Work in progress</h2></div>
</template>

<script setup>
// ==============
// Import
// ==============
import { ref, reactive, computed, onMounted } from "vue";
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

const gui = new GUI({
  width: 500,
  title: 'my debug UI',
  closeFolders: true,
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
  window.requestAnimationFrame( gameLoop );
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

  gui.hide();  
  // gameLoop();
});

</script>

<style lang="scss" scoped>
</style>
