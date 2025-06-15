import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import Experience from '../Experience.js';
import Renderer from '../Renderer.js';
import sources from '../sources.js';
import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
    constructor() {
        super();
        this.experince = new Experience();
        this.renderer = new Renderer();
        this.sources = sources;

        this.items = {};
        this.loaded = 0;
        this.total = this.sources.length;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltf = new GLTFLoader();

        this.loaders.texture = new THREE.TextureLoader();
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'gltf') {
                this.loaders.gltf.load(source.path, (gltf) => {
                    this.sourceLoaded(source, gltf.scene);
                });
            }
            else if (source.type === 'texture') {
                this.loaders.texture.load(
                    source.path,
                    (file) => {
                        file.flipY = false
                        file.encoding = THREE.sRGBEncoding
                        this.sourceLoaded(source, file)
                    }
                )
            }

        }

    }

    sourceLoaded(source, file) {
        console.log(source, file);
        this.trigger('itemLoaded');

        this.items[source.name] = file;
        this.loaded++;

        if (this.loaded === this.total) {
            this.trigger('ready');
        }
    }
}
