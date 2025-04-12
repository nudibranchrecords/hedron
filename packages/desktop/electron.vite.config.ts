import path from 'path'
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
    resolve: {
      alias: {
        // Setting aliases here to allow for hot module reloading
        '@hedron/ui-core/base.css': path.resolve(__dirname, '../ui-core/src/css/base.css'),
        '@hedron/ui-core/icons.css': path.resolve(__dirname, '../ui-core/src/css/icons.css'),
        '@hedron/ui-core/fonts.css': path.resolve(__dirname, '../ui-core/src/css/fonts.css'),
        '@hedron/ui-core': path.resolve(__dirname, '../ui-core/src'),
        '@hedron/midi-input': path.resolve(__dirname, '../midi-input/src'),
      },
    },
  },
})
