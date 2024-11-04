import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()],
  },
  preload: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()],
  },
  renderer: {
    plugins: [react(), tsconfigPaths()],
  },
})
