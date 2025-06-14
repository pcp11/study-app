import { defineStore } from 'pinia'

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
