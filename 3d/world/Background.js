import * as THREE from 'three'

import Experience from '../Experience.js'


export default class Background {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources;
        this.materials = this.experience.materials;

        // Remove model loading
        // this.resource = this.resources.items.backgroundModel;

        // this.parseModel(); // Not needed
        this.createPlane();
    }

    createPlane() {
        const geometry = new THREE.PlaneGeometry(10, 5);
        this.plane = new THREE.Mesh(geometry, this.materials.backgroundMaterial);
        this.plane.position.z = -5;
        this.plane.position.x = 6;
        this.plane.position.y = 2.5;
        this.plane.rotation.y = THREE.MathUtils.degToRad(-45);
        this.scene.add(this.plane);
    }

    // parseModel() {
    //     this.model = this.resource;
    //     // this.model.castShadow = true; // Set on children instead
    //     this.model.traverse((child) => {
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //         }
    //     });
    //
    //     console.log(this.model);
    //     //this.coreRoom = this.resource.children.find(child => child.name === "Room");
    //     //this.walls = this.coreRoom.children.find(child => child.name === "Plane002");
    //     //this.floor = this.coreRoom.children.find(child => child.name === "Plane002_1");
    // }

    // setMaterials() {
    //     //this.floor.material = this.materials.floorMaterial;
    //     //this.walls.material = this.materials.wallpaperMaterial;
    //
    //     this.scene.add(this.model);
    // }
}
