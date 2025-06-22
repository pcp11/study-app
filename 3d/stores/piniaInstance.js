import { createPinia } from 'pinia'

export const pinia = createPinia()

export function setupPinia() {
  return pinia
}
