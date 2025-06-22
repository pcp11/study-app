import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getSizeStore } from './stores/sizeStore.js'

import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizeStore = getSizeStore()

        this.setInstance()
        this.setControls()
        this.setResizeLister()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizeStore.width / this.sizeStore.height,
            0.1,
            200
        );
        this.instance.position.z = 10;
        this.instance.position.y = 5;
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;

    }

    setResizeLister() {
        // Update camera aspect ratio when size changes
        window.addEventListener('resize', () => {
            this.instance.aspect = this.sizeStore.width / this.sizeStore.height
            this.instance.updateProjectionMatrix()
        });
    }


    update() {
        this.controls.update()
    }
}
