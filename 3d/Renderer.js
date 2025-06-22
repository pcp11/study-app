import * as THREE from 'three'
import Experience from './Experience.js'
import { getSizeStore } from './stores/sizeStore.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.sizeStore = getSizeStore()

        this.setInstance()
        this.setResizeLister()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.instance.setSize(this.sizeStore.width, this.sizeStore.height);
        this.instance.setPixelRatio(this.sizeStore.pixelRatio);
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.VSMShadowMap;
    }

    setResizeLister() {
        // Update renderer when size changes
        window.addEventListener('resize', () => {
            this.instance.setSize(this.sizeStore.width, this.sizeStore.height);
            this.instance.setPixelRatio(this.sizeStore.pixelRatio);
        });
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}
