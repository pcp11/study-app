<template>
	<canvas ref="canvas" class="webgl"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';
import Experience from '../3d/Experience';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
	if (!canvas.value) {
		console.error("Three.js container not found");
		return;
	}
	const exp = new Experience(canvas.value);
	//const textureLoader = new THREE.TextureLoader();

	//const pane = new Pane();
	//const renderer = new THREE.WebGLRenderer({canvas: canvas.value, antialias: true})
	//const scene = new THREE.Scene()
	//const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000);
	//camera.position.z = 10
	//camera.position.y = 5
	//scene.add(camera)

	//const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

	//const uv2 = new THREE.BufferAttribute(new Float32Array(cubeGeometry.attributes.uv.array), 2);
	//cubeGeometry.attributes.uv = uv2;

	//const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
	//const planeGeometry = new THREE.PlaneGeometry(1, 1);
	//const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	//const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);

	//const grassAlbedo = textureLoader.load('/texture/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png');
	//const grassAo = textureLoader.load('/texture/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png');
	//const grassHeight = textureLoader.load('/texture/whispy-grass-meadow-bl/wispy-grass-meadow_height.png');
	//const grassMetallic = textureLoader.load('/texture/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png');
	//const grassNormal = textureLoader.load('/texture/whispy-grass-meadow-bl/wispy-grass-meadow_normal.png');
	//const grassRoughness = textureLoader.load('/texture/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png');

	//const material = new THREE.MeshPhysicalMaterial();
	//material.map = grassAlbedo;
	//material.roughnessMap = grassRoughness;
	//material.metalnessMap = grassMetallic;
	//material.normalMap = grassNormal;
	//material.displacementMap = grassHeight;
	//material.displacementScale = 0.1;
	//material.aoMap = grassAo;

	//material.side = THREE.DoubleSide;
	//material.color = new THREE.Color(0xFFFFFF);

	//const group = new THREE.Group();
	//const mesh = new THREE.Mesh(cubeGeometry, material);

	//const knot = new THREE.Mesh(torusGeometry, material);
	//knot.position.x = 1.5;

	//const plane = new THREE.Mesh(planeGeometry, material);
	//plane.position.x = -1.5;

	//const sphere = new THREE.Mesh();
	//sphere.geometry = sphereGeometry;
	//sphere.material = material;
	//sphere.position.y = 1.5;

	//const cylinder = new THREE.Mesh(cylinderGeometry, material);
	//cylinder.position.y = -1.5;

	//pane.addBinding(material, "metalness", {
	//  min: 0,
	//  max: 1,
	//  step: 0.01,
	//});

	//pane.addBinding(material, "roughness", {
	//  min: 0,
	//  max: 1,
	//  step: 0.01,
	//});

	//pane.addBinding(material, "reflectivity", {
	//  min: 0,
	//  max: 1,
	//  step: 0.01,
	//});

	//pane.addBinding(material, "clearcoat", {
	//  min: 0,
	//  max: 1,
	//  step: 0.01,
	//});

	//group.add(mesh, knot, plane, sphere, cylinder);
	//scene.add(group);

	//mesh.rotation.y = THREE.MathUtils.degToRad(90);

	//const axesHelper = new THREE.AxesHelper(2)
	//mesh.add(axesHelper);

	//const light = new THREE.AmbientLight(0xffffff, 0.3)
	//scene.add(light)

	//const pointLight = new THREE.PointLight(0xffffff, 100);
	//pointLight.position.set(5, 5, 5);
	//scene.add(pointLight);

	//renderer.setSize(window.innerWidth, window.innerHeight)
	//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	//const controls = new OrbitControls(camera, canvas.value)
	//controls.enableDamping = true
	////controls.autoRotate = true

	//window.addEventListener('resize', () => {
	//  camera.aspect = window.innerWidth / window.innerHeight
	//  camera.updateProjectionMatrix()
	//  renderer.setSize(window.innerWidth, window.innerHeight)
	//})

	//const clock = new THREE.Clock();
	//let previousTime = 0;

	//const animate = () => {
	//  controls.update()

	//  const currentTime = clock.getElapsedTime();
	//  const delta = currentTime - previousTime;
	//  previousTime = currentTime;

	//  group.children.forEach((child) => {
	//     if (child instanceof THREE.Mesh) {
	//        child.rotation.y += THREE.MathUtils.degToRad(1) * delta * 20;
	//     }
	//  });

	//  renderer.render(scene, camera)
	//  window.requestAnimationFrame(animate)
	//}

	//animate()
	//  const config = useRuntimeConfig();
	//  const baseURL = config.app.baseURL || '/';
	//  const textureLoader = new THREE.TextureLoader();
	//
	//  // Wallpaper Texture
	//  const wallpaperTexture = textureLoader.load(
	//    `${baseURL}texture/wallpaper.jpg`.replace(/\/\//g, '/'),
	//    (texture) => {
	//      texture.wrapS = THREE.RepeatWrapping;
	//      texture.wrapT = THREE.RepeatWrapping;
	//      texture.repeat.set(2, 1);
	//    }
	//  );
	//  const wallMaterial = new THREE.MeshStandardMaterial({
	//    map: wallpaperTexture,
	//    side: THREE.DoubleSide,
	//  });
	//
	//  // Wood Floor Texture
	//  const woodFloorTexture = textureLoader.load(
	//    `${baseURL}texture/wood.jpg`.replace(/\/\//g, '/'),
	//    (texture) => {
	//      texture.wrapS = THREE.RepeatWrapping;
	//      texture.wrapT = THREE.RepeatWrapping;
	//      texture.repeat.set(4, 4);
	//    }
	//  );
	//  const floorMaterial = new THREE.MeshStandardMaterial({
	//    map: woodFloorTexture,
	//    side: THREE.DoubleSide,
	//  });
	//
	//  const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
	//
	//
	// const roomDimensions = { width: 15, height: 6, depth: 10 }
	//
	//  // Floor
	//  const floorGeometry = new THREE.PlaneGeometry(width, 10);
	//  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	//  floor.rotation.x = -Math.PI / 2;
	//  floor.position.x = 0;
	//  floor.position.y = 0;
	//  floor.receiveShadow = true;
	//  scene.add(floor);
	//
	//  // Ceiling
	//  const ceilingGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
	//  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
	//  ceiling.rotation.x = Math.PI / 2;
	//  ceiling.position.y = roomDimensions.height;
	//  scene.add(ceiling);
	//
	//  // Walls
	//  const backWallGeometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height);
	//  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
	//  backWall.position.z = -roomDimensions.depth / 2;
	//  backWall.position.y = roomDimensions.height / 2;
	//  backWall.receiveShadow = true;
	//  scene.add(backWall);
	//
	//  const sideWallGeometry = new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height);
	//  const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
	//  leftWall.position.x = -roomDimensions.width / 2;
	//  leftWall.position.y = roomDimensions.height / 2;
	//  leftWall.rotation.y = Math.PI / 2;
	//  leftWall.receiveShadow = true;
	//  scene.add(leftWall);
	//
	//  const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
	//  rightWall.position.x = roomDimensions.width / 2;
	//  rightWall.position.y = roomDimensions.height / 2;
	//  rightWall.rotation.y = -Math.PI / 2;
	//  rightWall.receiveShadow = true;
	//  scene.add(rightWall);
	//
	//onst threeContext = initThreeScene();
	// localCameraInstance = threeContext.camera;

	// if (localCameraInstance) {
	//   pointerControls = usePointerControls({
	//     camera: localCameraInstance,
	//     threeContainer:canvas,
	//   });
	//   pointerControls.setInitialCameraRotation(threeContext.initialCameraEulerX, threeContext.initialCameraEulerY);
	//   pointerControls.setupPointerListeners();
	// } else {
	//   console.error("Camera not initialized by useThreeScene");
	// }

	// handleResizeFunction = () => {
	//   if (localCameraInstance && renderer.value) {
	//     localCameraInstance.aspect = window.innerWidth / window.innerHeight;
	//     localCameraInstance.updateProjectionMatrix();
	//     renderer.value.setSize(window.innerWidth, window.innerHeight);
	//   }
	// };
	// window.addEventListener('resize', handleResizeFunction);
});

onUnmounted(() => {
	//if (handleResizeFunction) {
	//  window.removeEventListener('resize', handleResizeFunction);
	//}
	//if (pointerControls) {
	//  pointerControls.removePointerListeners();
	//}
	//cleanupThreeScene();
});
</script>

<style>
body {
	margin: 0;
	overflow: hidden;
}
</style>
