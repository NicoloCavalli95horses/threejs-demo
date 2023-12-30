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
const sizes = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
});
const aspect_ratio = computed(() => sizes.width / sizes.height);

const textLoader = new THREE.TextureLoader();
const particleTexture = textLoader.load('/textures/particles/2.png');

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
scene.add(ambientLight);

// Clock
const clock = new THREE.Clock();

/**
 * Particles: used to create stars, smoke, rain, dust, fire
 * You can have thousands of them with a reasonable frame rate.
 * Each particle is composed of a plane (two triangles) always facing the camera
 * 
 * To create a particle:
 * - geometry (BufferGeometry)
 * - material (PointsMaterial)
 * - points (instead of a mesh)
 * 
 * By default the particle is a square
*/

const particleGeometry = new THREE.BufferGeometry(); // custom geometry
const count = 5000;
const positions = new Float32Array(count*3);
const colors = new Float32Array(count*3);

for ( let i = 0; i< count * 3; i++ ) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute( positions, 3 )
);
particleGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute( colors, 3 )
);

const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true, // false: size invariant regardless of the zoom
  // color: new THREE.Color('#eee'),
  vertexColors: true, // use custom color
  transparent: true,
  alphaMap: particleTexture,
  // alphaTest: 0.001 // value between 0-1 that enables WebGL to know when not to render a px, based on px transparency
  // depthTest: false // do not render a particle if is in front of the other (may cause unrealistic effects with other object)
  depthWrite: false,
  blending: THREE.AdditiveBlending // create a glow effect. This impact the performance
});
gui.add(particleMaterial, "size").min(0.01).max(0.07).step(0.005);


const particle = new THREE.Points( particleGeometry, particleMaterial );
scene.add( particle );



// ==============
// Functions
// ==============
function updateScene() {
  controls.update();
  const elapsedTime = clock.getElapsedTime();

  // this method is not the best in terms of performance. A better solution is making use of shaders

  // particle.rotation.y = elapsedTime * 0.2; // every particle will move in the same direction
  for ( let i = 0; i < count; i++ ) {
    const i3 = i*3;
    const particle_x = particleGeometry.attributes.position.array[i3 + 0];
    // offset the animation depending on the x position
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + particle_x); 
  }
  // tell Three.js the attributes needs to be updated
  particleGeometry.attributes.position.needsUpdate = true;

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


// ==============
// Life cycle
// ==============
onMounted(() => {
  window.addEventListener("resize", onResize);
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
  cancelAnimationFrame(animation_frame);
});

</script>

<style lang="scss" scoped></style>
