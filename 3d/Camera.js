import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getSizeStore } from './stores/sizeStore.js'

import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizeStore = getSizeStore()
        this.debug = this.experience.debug

        this.setInstance()
        this.setControls()
        this.setResizeLister()
        this.setDebug()
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

    setDebug() {
        const cameraFolder = this.debug.addFolder({ title: 'Camera' });
        cameraFolder.addBinding(this.instance.position, 'x', { min: -20, max: 20, step: 0.1, label: 'Position X' });
        cameraFolder.addBinding(this.instance.position, 'y', { min: -20, max: 20, step: 0.1, label: 'Position Y' });
        cameraFolder.addBinding(this.instance.position, 'z', { min: -20, max: 20, step: 0.1, label: 'Position Z' });

        const targetFolder = this.debug.addFolder({ title: 'Camera Target (LookAt)' });
        targetFolder.addBinding(this.controls.target, 'x', { min: -20, max: 20, step: 0.1, label: 'Target X' });
        targetFolder.addBinding(this.controls.target, 'y', { min: -20, max: 20, step: 0.1, label: 'Target Y' });
        targetFolder.addBinding(this.controls.target, 'z', { min: -20, max: 20, step: 0.1, label: 'Target Z' });
    }
}
