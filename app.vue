<template>
  <div ref="threeContainer" style="width: 100vw; height: 100vh; overflow: hidden;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';

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
    const roomDepth = 15;
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, roomDepth / 2 - 2); // Positioned at eye level, near one end of the room
    camera.lookAt(0, 1.6, -roomDepth / 2); // Looking towards the center of the far wall
    camera.rotation.order = 'YXZ'; // Set rotation order for more intuitive control

    // Store initial camera rotation after lookAt and setting order.
    // camera is guaranteed to be non-null here within onMounted's main block.
    initialCameraEulerX = camera.rotation.x;
    initialCameraEulerY = camera.rotation.y;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainer.value.appendChild(renderer.domElement);

    // Room
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = 0;
    scene.add(floor);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2; // Rotate to be horizontal
    ceiling.position.y = roomHeight;
    scene.add(ceiling);

    // Walls
    // Back wall (the one camera is looking at)
    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -roomDepth / 2;
    backWall.position.y = roomHeight / 2;
    scene.add(backWall);

    // Front wall (behind the camera, optional if not visible)
    // const frontWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    // frontWall.position.z = roomDepth / 2;
    // frontWall.position.y = roomHeight / 2;
    // frontWall.rotation.y = Math.PI; // Rotate to face inwards
    // scene.add(frontWall);


    // Left wall
    const sideWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.x = -roomWidth / 2;
    leftWall.position.y = roomHeight / 2;
    leftWall.rotation.y = Math.PI / 2; // Rotate to be perpendicular
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.x = roomWidth / 2;
    rightWall.position.y = roomHeight / 2;
    rightWall.rotation.y = -Math.PI / 2; // Rotate to be perpendicular
    scene.add(rightWall);

    // Add a light for better visibility if we switch to MeshStandardMaterial later
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, roomHeight * 0.8, 0);
    scene.add(pointLight);

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
