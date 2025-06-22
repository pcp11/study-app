import { defineStore } from 'pinia'
import { pinia, setupPinia } from './piniaInstance.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import sources from '../sources.js';

setupPinia()

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    items: {}, // Mirrored from Resources.js
    loaded: 0,   // Mirrored from Resources.js
    total: 0,    // Initialized by Resources.js
    isReadyState: false // Mirrored from Resources.js
  }),

  actions: {
    setItem(name, asset) {
      this.items = { ...this.items, [name]: asset };
    },
    setLoadedCount(count) {
      this.loaded = count;
    },
    setTotalCount(count) {
      this.total = count;
    },
    setReadyState(isReady) {
      this.isReadyState = isReady;
    },
    // Action to reset items and loaded state, typically when loading restarts
    resetLoadingState() {
      this.items = {};
      this.loaded = 0;
      this.isReadyState = false;
      // Total count usually persists unless sources change, which is not handled here.
    }
  },

  getters: {
    areAllItemsLoaded: (state) => state.isReadyState,
    getItem: (state) => (name) => state.items[name]
  }
})

export function getResourcesStore() {
  setupPinia() // Ensure Pinia is set up when the store is accessed
  return useResourcesStore(pinia)
}
