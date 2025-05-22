<template>
  <div ref="threeContainer" style="width: 100vw; height: 100vh; overflow: hidden;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const isDragging = ref(false);
const previousMousePosition = { x: 0, y: 0 };
const mouseSensitivity = 0.002; // Sensitivity for mouse movement
const maxVerticalRotationDelta = Math.PI / 18; // Max +/- 10 degrees change vertically
const maxHorizontalRotationDelta = Math.PI / 12; // Max +/- 15 degrees change horizontally

let initialCameraEulerX = 0; // To store the camera's initial X rotation
let initialCameraEulerY = 0; // To store the camera's initial Y rotation

// Pointer event handlers defined in the script setup scope
// These need `camera`, `threeContainer`, etc., to be initialized/available when called.
const onPointerDown = (event: PointerEvent) => {
  if (!camera || !threeContainer.value) return; // Guard against uninitialized objects
  event.preventDefault(); // Prevent default browser actions (e.g., text selection)
  isDragging.value = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
  threeContainer.value.setPointerCapture(event.pointerId); // Capture pointer for consistent dragging
};

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value || !camera) return;
  event.preventDefault();

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Adjust camera rotation based on mouse delta
  // camera.rotation is an Euler object. Its order is set to 'YXZ' in onMounted.
  let newRotationY = camera.rotation.y - deltaX * mouseSensitivity;
  let newRotationX = camera.rotation.x - deltaY * mouseSensitivity;

  // Clamp the rotation to be within the defined delta from the initial orientation
  camera.rotation.y = THREE.MathUtils.clamp(newRotationY, initialCameraEulerY - maxHorizontalRotationDelta, initialCameraEulerY + maxHorizontalRotationDelta);
  camera.rotation.x = THREE.MathUtils.clamp(newRotationX, initialCameraEulerX - maxVerticalRotationDelta, initialCameraEulerX + maxVerticalRotationDelta);
  camera.rotation.z = 0; // Explicitly keep Z rotation (roll) at 0

  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
};

const onPointerUp = (event: PointerEvent) => {
  if (!camera || !threeContainer.value) return;
  isDragging.value = false;
  threeContainer.value.releasePointerCapture(event.pointerId);
};

const onPointerLeave = (event: PointerEvent) => { // Handle mouse leaving the canvas while dragging
  if (isDragging.value && threeContainer.value && camera) {
    isDragging.value = false;
    threeContainer.value.releasePointerCapture(event.pointerId);
  }
};

const threeContainer = ref<HTMLDivElement | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
// let cube: THREE.Mesh | null = null; // Cube removed
let animationFrameId: number | null = null;

onMounted(() => {
  if (threeContainer.value) {
    // Scene
    scene = new THREE.Scene();

    // Camera
    const roomWidth = 15; // Increased room width
    const roomHeight = 6;
    const roomDepth = 10; // --- Reduced room depth ---
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2.5, roomDepth / 2 - 2); // Positioned at eye level, near one end of the room (auto-adjusts)
    camera.lookAt(0, 1.6, -roomDepth / 2); // Looking towards the center of the far wall (auto-adjusts)
    camera.rotation.order = 'YXZ'; // Set rotation order for more intuitive control

    // Store initial camera rotation after lookAt and setting order.
    // camera is guaranteed to be non-null here within onMounted's main block.
    initialCameraEulerX = camera.rotation.x;
    initialCameraEulerY = camera.rotation.y;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Correct color space for PBR
    threeContainer.value.appendChild(renderer.domElement);

    // Room
    const textureLoader = new THREE.TextureLoader(); // Moved loader instantiation up

    const wallpaperTexture = textureLoader.load(
      '/texture/wallpaper.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 1); // Repeat twice horizontally, once vertically
      }
    );
    const wallMaterial = new THREE.MeshStandardMaterial({ // Changed to MeshStandardMaterial
      map: wallpaperTexture,
      side: THREE.DoubleSide
    });

    const woodFloorTexture = textureLoader.load(
      '/texture/wood.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4); // Repeat 4 times horizontally and vertically
      }
    );
    const floorMaterial = new THREE.MeshStandardMaterial({ // Changed to MeshStandardMaterial to react to lights
      map: woodFloorTexture,
      side: THREE.DoubleSide
    });

    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth); // Auto-adjusts
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = 0;
    scene.add(floor);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth); // Auto-adjusts
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2; // Rotate to be horizontal
    ceiling.position.y = roomHeight;
    scene.add(ceiling);

    // Walls
    // Back wall (the one camera is looking at)
    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -roomDepth / 2; // Auto-adjusts
    backWall.position.y = roomHeight / 2;
    scene.add(backWall);

    // Front wall (behind the camera, optional if not visible)
    // const frontWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    // frontWall.position.z = roomDepth / 2;
    // frontWall.position.y = roomHeight / 2;
    // frontWall.rotation.y = Math.PI; // Rotate to face inwards
    // scene.add(frontWall);


    // Left wall
    const sideWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight); // Auto-adjusts
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.x = -roomWidth / 2;
    leftWall.position.y = roomHeight / 2;
    leftWall.rotation.y = Math.PI / 2; // Rotate to be perpendicular
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial); // Geometry already updated
    rightWall.position.x = roomWidth / 2;
    rightWall.position.y = roomHeight / 2;
    rightWall.rotation.y = -Math.PI / 2; // Rotate to be perpendicular
    scene.add(rightWall);

    // Add a light for better visibility if we switch to MeshStandardMaterial later
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased intensity
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100); // Increased intensity, added decay distance
    pointLight.position.set(0, roomHeight * 0.9, roomDepth * 0.25); // Z position auto-adjusts
    scene.add(pointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.2); // Sky, Ground, Intensity
    hemisphereLight.position.set(0, roomHeight, 0);
    scene.add(hemisphereLight);


    // Load the GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/model/study+desk.glb', // Corrected path from /model/ to /models/
      (gltf) => {
        const deskModel = gltf.scene;
        // Adjust model position, scale, rotation as needed
        // For example, place it on the floor (y=0) in the center
        // The model's origin might be at its base or center, adjust y accordingly
        // Let's assume its origin is at its base for now.
        deskModel.position.set(0, 0, -2); // Adjusted for new room depth, closer to new back wall (at z=-5)
        deskModel.rotation.y = Math.PI; // Rotate 180 degrees around Y-axis

        // You might need to scale it down if it's too large
        deskModel.scale.set(1.1, 1.1, 1.1);

        // --- Material Override for Diagnostics ---
        const overrideMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.7 });
        deskModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = overrideMaterial;
          }
        });
        // --- End Material Override ---

        if (scene) {
          scene.add(deskModel);
        }
        console.log('Desk model loaded and added to scene (with material override)', deskModel);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened loading the desk model:', error);
      }
    );

    // Add pointer event listeners for mouse view control
    if (threeContainer.value) {
        threeContainer.value.addEventListener('pointerdown', onPointerDown);
        threeContainer.value.addEventListener('pointermove', onPointerMove);
        threeContainer.value.addEventListener('pointerup', onPointerUp);
        threeContainer.value.addEventListener('pointerleave', onPointerLeave);
    }

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (renderer && scene && camera) {
        // No specific animation for the room, just render
        renderer.render(scene, camera);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    onUnmounted(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);

      // Remove pointer event listeners during cleanup
      if (threeContainer.value) {
          threeContainer.value.removeEventListener('pointerdown', onPointerDown);
          threeContainer.value.removeEventListener('pointermove', onPointerMove);
          threeContainer.value.removeEventListener('pointerup', onPointerUp);
          threeContainer.value.removeEventListener('pointerleave', onPointerLeave);
      }

      if (renderer) {
        renderer.dispose();
      }
      if (threeContainer.value && renderer) {
        threeContainer.value.removeChild(renderer.domElement);
      }
    });
  }
});
</script>

<style>
body {
  margin: 0;
}
</style>
