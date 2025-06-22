import * as THREE from 'three';
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Loop from './utils/Loop.js'
import World from './world/World.js'
import Resize from './utils/Resize.js'
import Resources from './utils/Resources.js';
import Materials from './world/Materials.js';

let instance = null;

export default class Experience {
    constructor(canvas) {
        if (instance) return instance
        instance = this

        this.canvas = canvas;
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.resources = new Resources();
        this.materials = new Materials()
        this.world = new World()
        this.loop = new Loop()
        this.resize = new Resize()
    }
}
