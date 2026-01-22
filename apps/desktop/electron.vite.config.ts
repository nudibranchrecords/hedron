import path from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()],
    envPrefix: 'HEDRON_',
  },
  preload: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()],
  },
  renderer: {
    plugins: [react(), tsconfigPaths()],
    envPrefix: 'HEDRON_',
    resolve: {
      alias: {
        // Setting aliases here to allow for hot module reloading
        '@hedron/ui-core/base.css': path.resolve(
          __dirname,
          '../../packages/ui-core/src/css/base.css',
        ),
        '@hedron/ui-core/icons.css': path.resolve(
          __dirname,
          '../../packages/ui-core/src/css/icons.css',
        ),
        '@hedron/ui-core/fonts.css': path.resolve(
          __dirname,
          '../../packages/ui-core/src/css/fonts.css',
        ),
        '@hedron/ui-core': path.resolve(__dirname, '../../packages/ui-core/src'),
        '@hedron/midi-input': path.resolve(__dirname, '../../packages/midi-input/src'),
        '@hedron/lfo-input': path.resolve(__dirname, '../../packages/lfo-input/src'),
        '@hedron/audio-input': path.resolve(__dirname, '../../packages/audio-input/src'),
        '@hedron/app-store': path.resolve(__dirname, '../../packages/app-store/src'),
        '@hedron/clock': path.resolve(__dirname, '../../packages/clock/src'),
        '@hedron/engine': path.resolve(__dirname, '../../packages/engine/src'),
        '@hedron/midi-manager': path.resolve(__dirname, '../../packages/midi-manager/src'),
      },
    },
  },
})
