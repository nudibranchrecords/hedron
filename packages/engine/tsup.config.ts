import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/react.ts'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: true,
  target: 'esnext',
})
