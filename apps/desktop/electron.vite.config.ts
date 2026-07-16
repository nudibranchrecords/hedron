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
        '@hedron-gl/ui-core/base.css': path.resolve(
          __dirname,
          '../../packages/ui-core/src/css/base.css',
        ),
        '@hedron-gl/ui-core/icons.css': path.resolve(
          __dirname,
          '../../packages/ui-core/src/css/icons.css',
        ),
        '@hedron-gl/ui-core/fonts.css': path.resolve(
          __dirname,
          '../../packages/ui-core/src/css/fonts.css',
        ),
        '@hedron-gl/ui-core': path.resolve(__dirname, '../../packages/ui-core/src'),
        '@hedron-gl/midi-input': path.resolve(__dirname, '../../packages/midi-input/src'),
        '@hedron-gl/lfo-input': path.resolve(__dirname, '../../packages/lfo-input/src'),
        '@hedron-gl/gamepad-input': path.resolve(__dirname, '../../packages/gamepad-input/src'),
        '@hedron-gl/audio-input': path.resolve(__dirname, '../../packages/audio-input/src'),
        '@hedron-gl/app-store': path.resolve(__dirname, '../../packages/app-store/src'),
        '@hedron-gl/clock': path.resolve(__dirname, '../../packages/clock/src'),
        '@hedron-gl/engine': path.resolve(__dirname, '../../packages/engine/src'),
        '@hedron-gl/midi-manager': path.resolve(__dirname, '../../packages/midi-manager/src'),
        '@hedron-gl/timeline': path.resolve(__dirname, '../../packages/timeline/src'),
        '@hedron-gl/scene-control': path.resolve(__dirname, '../../packages/scene-control/src'),
        '@hedron-gl/param-favourites': path.resolve(
          __dirname,
          '../../packages/param-favourites/src',
        ),
      },
    },
  },
})
