import * as THREE from 'three'

import Experience from '../Experience.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources;

        this.resources.on('ready', () => {
            console.log('resources ready');
            console.log(this.resources.items);

            const roomModel = this.resources.items.roomModel;
            const floorTexture = this.resources.items.floorTexture;
            const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
            const wallpaperTexture = this.resources.items.wallpaperTexture;
            const wallpaperMaterial = new THREE.MeshStandardMaterial({ map: wallpaperTexture });
            console.log(floorTexture);

            roomModel.children[0].children[0].material = wallpaperMaterial;
            roomModel.children[0].children[1].material = floorMaterial;

            this.scene.add(roomModel);

            const pointLight = new THREE.PointLight(0xffffff, 10);
            const pointLightHelper = new THREE.PointLightHelper(pointLight);
            pointLight.position.set(-3, 2, -2);
            this.scene.add(pointLight);
            this.scene.add(pointLightHelper);

            console.log(this.scene);
        });


        //this.setCube()
        this.loop()
    }

    setCube() {

        this.cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );

        this.scene.add(this.cubeMesh)

    }


    loop() {

        //this.cubeMesh.rotation.y += 0.01

    }
}
