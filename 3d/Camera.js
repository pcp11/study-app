import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


import Experience from './Experience.js'

export default class Camera {
	constructor() {
		this.experience = new Experience()
		this.canvas = this.experience.canvas


		this.sizes = { width: window.innerWidth, height: window.innerHeight };

		this.setInstance()
		this.setControls()
		this.setResizeLister()
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			200
		);
		this.instance.position.z = 5;
	}

	setControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = true;

	}

	setResizeLister() {
	}


	loop() {
		this.controls.update()
	}
}
