import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// Get all sketch directories
const sketchesDir = resolve(__dirname, 'src/sketches')
const sketchDirs = readdirSync(sketchesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

// Create entry points for each sketch
const sketchEntries = sketchDirs.reduce(
  (entries, sketchName) => {
    entries[`sketches/${sketchName}/index`] = resolve(sketchesDir, sketchName, 'index.ts')
    return entries
  },
  {} as Record<string, string>,
)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...sketchEntries,
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.startsWith('sketches/')) {
            return '[name].js'
          }
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
