import { useSizeStore } from '../stores/sizeStore.js'

export default class Resize {
	constructor() {
		this.sizeStore = useSizeStore()
		
		// Initialize size on creation
		this.sizeStore.updateSize()

		window.addEventListener("resize", () => {
			this.sizeStore.updateSize()
		});
	}
}
