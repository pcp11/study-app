import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Loop {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer
        this.world = this.experience.world

        this.loop()
    }

    loop() {
        this.world.update()

        this.camera.update()
        this.renderer.update()
        window.requestAnimationFrame(() => this.loop())
    }
}
