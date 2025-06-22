import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Materials {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('ready', () => {
            this.mapTextures();
        });

    }

    mapTextures() {
        this.floorMaterial = new THREE.MeshStandardMaterial({ map: this.resources.items.floorTexture });
        this.wallpaperMaterial = new THREE.MeshStandardMaterial({ map: this.resources.items.wallpaperTexture });
    }
}
