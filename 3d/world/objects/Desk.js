import * as THREE from 'three'

import Experience from '../../Experience.js'


export default class Chair {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources;
        this.materials = this.experience.materials

        this.resource = this.resources.items.deskModel;

        this.parseModel();
        this.setMaterials();
    }

    parseModel() {
        this.model = this.resource;
        // this.model.castShadow = true; // Set on children instead
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });

        console.log(this.model);
        //this.coreRoom = this.resource.children.find(child => child.name === "Room");
        //this.walls = this.coreRoom.children.find(child => child.name === "Plane002");
        //this.floor = this.coreRoom.children.find(child => child.name === "Plane002_1");
    }

    setMaterials() {
        //this.floor.material = this.materials.floorMaterial;
        //this.walls.material = this.materials.wallpaperMaterial;

        this.scene.add(this.model);
    }
}
