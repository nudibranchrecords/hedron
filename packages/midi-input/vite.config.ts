import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: ['src/index.ts'],
      name: 'midi-input',
      fileName: (format) => `midi-input.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'React',
        },
      },
    },
  },
})
