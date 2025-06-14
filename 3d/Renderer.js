import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer {
	constructor() {
		this.experience = new Experience()
		this.canvas = this.experience.canvas
		this.camera = this.experience.camera
		this.scene = this.experience.scene
		this.sizes = { width: window.innerWidth, height: window.innerHeight, pixelRatio: window.devicePixelRatio };

		this.setInstance()
		this.setResizeLister()
	}

	setInstance() {
		this.instance = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});
		this.instance.setSize(this.sizes.width, this.sizes.height);
		this.instance.setPixelRatio(this.sizes.pixelRatio);
	}

	setResizeLister() {
	}

	loop() {
		this.instance.render(this.scene, this.camera.instance)
	}
}
