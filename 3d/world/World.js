import * as THREE from 'three'
import Room from './Room.js'
import Chair from './objects/Chair.js'
import Desk from './objects/Desk.js'
import Wardrobe from './objects/Wardrobe.js'
import Shelf from './objects/Shelf.js'
import Experience from '../Experience.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources;

        this.resources.on('ready', () => {
            this.room = new Room();
            this.chair = new Chair();
            this.desk = new Desk();
            this.wardrobe = new Wardrobe();
            this.shelf = new Shelf();

            const pointLight = new THREE.PointLight(0xffffff, 6);
            const pointLightHelper = new THREE.PointLightHelper(pointLight);
            pointLight.position.set(0, 2, 0);

            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = 1024;
            pointLight.shadow.mapSize.height = 1024;
            pointLight.shadow.radius = 5;
            pointLight.shadow.bias = -0.005;
            pointLight.shadow.camera.near = 0.1;
            pointLight.shadow.camera.far = 16;

            // For debugging the shadow camera frustum:
            const lightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
            this.scene.add(lightCameraHelper);

            this.scene.add(pointLight);
            this.scene.add(pointLightHelper);

        });
    }

    update() {
    }
}
