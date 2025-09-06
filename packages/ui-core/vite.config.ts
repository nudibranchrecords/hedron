import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), dts({ rollupTypes: true })],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: ['src/index.ts', 'src/css/base.css', 'src/css/fonts.css', 'src/css/icons.css'],
      name: 'ui-core',
      fileName: (format, entryName) => {
        if (entryName !== 'index') {
          return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
        }
        return `ui-core.${format === 'es' ? 'es' : 'cjs'}.js`
      },
      formats: ['es', 'cjs'],
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
