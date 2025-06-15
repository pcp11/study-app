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
		this.world.loop()

		this.camera.loop()
		this.renderer.loop()
		window.requestAnimationFrame(() => this.loop())
	}
}
