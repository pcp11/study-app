import { defineStore } from 'pinia'
import { pinia, setupPinia } from './piniaInstance.js'

// Make sure pinia is set up
setupPinia()

export const useSizeStore = defineStore('size', {
  state: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio
  }),
  
  actions: {
    updateSize() {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = window.devicePixelRatio
    }
  },
  
  getters: {
    aspectRatio: (state) => state.width / state.height
  }
})

// Helper function to get the store outside of Vue components
export function getSizeStore() {
  setupPinia() // Ensure pinia is ready
  return useSizeStore(pinia)
}
