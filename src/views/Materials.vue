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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // from three.js lib
import GUI from 'lil-gui';
import LoadingSpinner from '../components/LoadingSpinner.vue';

// ==============
// Variables
// ==============
const gui = new GUI();

const FOV = 75;
const show_wireframe = true;
let animation_frame = undefined;

const BASE_URL = '/material_textures/';
const SRC_DOOR_COLOR = BASE_URL + 'door/color.jpg';
const SRC_DOOR_ALPHA = BASE_URL + 'door/alpha.jpg';
const SRC_DOOR_AMBIENT_OCCLUSION = BASE_URL + 'door/ambientOcclusion.jpg';
const SRC_DOOR_HEIGHT = BASE_URL + 'door/height.jpg';
const SRC_DOOR_NORMAL = BASE_URL + 'door/normal.jpg';
const SRC_DOOR_METALNESS = BASE_URL + 'door/metalness.jpg';
const SRC_DOOR_ROUGHNESS = BASE_URL + 'door/roughness.jpg';
const SRC_MAPCAPS = BASE_URL + 'matcaps/3.png';
const SRC_GRADIENT = BASE_URL + 'gradients/3.jpg';

const canvas_ref   = ref(undefined);
const sizes        = reactive({ width: window.innerWidth, height: window.innerHeight });
const aspect_ratio = computed(() => sizes.width / sizes.height );
const is_loading   = ref( true );

// Scene
const scene = new THREE.Scene();

// Renderer
let renderer = null;

// texture loader
const textureLoader = new THREE.TextureLoader();
const doorColor = textureLoader.load(SRC_DOOR_COLOR);
doorColor.colorSpace = THREE.SRGBColorSpace;
const doorAlpha = textureLoader.load(SRC_DOOR_ALPHA);
const doorAmbientOcclusion = textureLoader.load(SRC_DOOR_AMBIENT_OCCLUSION);
const doorHeight = textureLoader.load(SRC_DOOR_HEIGHT);
const doorNormal = textureLoader.load(SRC_DOOR_NORMAL);
const doorMetalness = textureLoader.load(SRC_DOOR_METALNESS);
const doorRoghness = textureLoader.load(SRC_DOOR_ROUGHNESS);
const matcap = textureLoader.load(SRC_MAPCAPS);
matcap.colorSpace = THREE.SRGBColorSpace;
const gradient = textureLoader.load(SRC_GRADIENT);

// Controls
let controls;

// Clock
const clock = new THREE.Clock();

// Camera
const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio.value);

// ==============
// BASIC
// ==============
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColor;
// material.color = new THREE.Color('red'); // color applied on the texture
// material.wireframe = boolean
// material.transparent = true;
// material.opacity = 0.2; // opacity only applies with transparent true
// material.alphaMap = doorAlpha; 
// material.side = THREE.DoubleSide; // the texture is applied on the backside too. It allows to see inside objects too. Expensive computationally

// ==============
// NORMALS
// ==============
// normals are information encoded in each vertex that contains the direction of the outside of the face
// const material = new THREE.MeshNormalMaterial();
// material.side = THREE.DoubleSide;
// material.wireframe = true;
// material.flatShading = true;

// normals are used for thinhs like calculating how to illuminate the face or how the environment should reflect or refract on the geometries' surface. The color will display the NORMAL ORIENTATION relative to the camera

// ==============
// MATCAP
// ==============
// const material = new THREE.MeshMatcapMaterial(); // very performant
// material.matcap = matcap;
// material.side = THREE.DoubleSide;

// with matcap meshes appear illuminated but it's an illusion created by the texture
// the result is the same regardless of the camera orientation and we cannot update the lights
// helpful if the camera is static as the performance is improved
// more matcap on https://github.com/nidorx/matcaps

// ==============
// DEPTH
// ==============
// the color depends on the distance of the camera
// const material = new THREE.MeshDepthMaterial(); 
// material.side = THREE.DoubleSide;

// ==============
// LAMBERT
// ==============
// the first material that requires light. You can't see anything without light!
// most performant material that uses light
// const material = new THREE.MeshLambertMaterial(); 
// material.side = THREE.DoubleSide;

// ==============
// PHONG
// ==============
// const material = new THREE.MeshPhongMaterial(); 
// material.side = THREE.DoubleSide;
// control the light refleciton intensity with the SHININESS
// material.shininess = 100;

// control the light reflection color with the SPECULAR
// material.specular = new THREE.Color('white');

// ==============
// TOON
// ==============
// cartoon effects on objects
// two-part coloration (one for the shadow and one for the light)
// add more steps with gradientTexture on the gradientMap property
// const material = new THREE.MeshToonMaterial(); 
// material.side = THREE.DoubleSide;
// gradient.minFilter = THREE.NearestFilter;
// gradient.magFilter = THREE.NearestFilter;
// gradient.generateMipMaps = false;
// material.gradientMap = gradient;

// ==============
// STANDARD
// ==============
// use physically based rendering principle like in the textures lesson
// support lights but with a more realistic algorithm and better parameters like roughness and metalness
// similar output in different rendering engine (Unreal, Unity)
const material = new THREE.MeshStandardMaterial(); 
material.side = THREE.DoubleSide;
material.metalness = 1;
material.roughness = 0;
// material.map = doorColor;
// material.aoMap = doorAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeight;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalness;
// material.roughnessMap = doorRoghness;
// material.normalMap = doorNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlpha;

gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);


// ==============
// PHYSICAL
// ==============
// similar to standard but with more featured (the WORST in term of efficiency)
// const material = new THREE.MeshPhysicalMaterial(); 
// material.side = THREE.DoubleSide;
// material.metalness = 1;
// material.roughness = 1; //0;
// material.map = doorColor;
// material.aoMap = doorAmbientOcclusion;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeight;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalness;
// material.roughnessMap = doorRoghness;
// material.normalMap = doorNormal;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlpha;

// clearcoth: simulates a thin layer on top of the material
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// sheen: highlights the material when seen from a narrow angle. Used for fabric
// material.sheen = 1;
// material.sheenRoughness = 0.4;
// material.sheenColor.set(1, 1, 1);

// iridescence (rainbow effect): creates color artifacts like puddle, soap bubbles, laser discs, ecc
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [ 100, 800 ];

// trasmission: enable light to go through the material (used with liquids, gel, fluids)
// material.transmission = 1;
// material.ior = 1.5; // index of reflection (diamond: 2.417, water: 1.333, air: 1.000293...see more on Wikipedia)
// material.thickness = 0.5;


// LIGHTS will be ignored if a environment map is present (!)
// lights
// const ambientLight = new THREE.AmbientLight('white', 1); //color, intensity
// const pointLight = new THREE.PointLight('white', 30);

// by default the ligth is at the very center
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
);
sphere.position.y = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  material
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.y = 1.5;

scene.add(sphere, plane, torus);


// ==============
// Environment map
// ==============
// environment map (after the scene is declared)
// this map is an image in a special format (.hdr) that stores data about the light
const rgbeLoader = new RGBELoader();
rgbeLoader.load( BASE_URL + 'environmentMap/sky.hdr', (environmentMap) => {
 environmentMap.mapping = THREE.EquirectangularReflectionMapping;
 scene.background = environmentMap;
 scene.environment = environmentMap;
 is_loading.value = false;
})


// ==============
// Functions
// ==============
function updateScene() {
  controls.update();

  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;
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

  camera.position.z = 6;
  
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
