import { createPinia } from 'pinia'

// Create pinia instance
export const pinia = createPinia()

// Function to ensure pinia is ready for use
export function setupPinia() {
  // This would normally be done by app.use(pinia) in a Vue app
  // For vanilla JS usage, we just need to ensure the pinia instance exists
  return pinia
}
