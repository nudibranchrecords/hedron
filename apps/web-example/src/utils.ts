import { processConfig } from '@hedron/engine'

// TODO: This file should be exported as a helper package somewhere (vite plugin?)

// This is a special vite syntax that allows us to statically import multiple files based on a glob pattern
const sketchModules = import.meta.glob('./sketches/*/index.ts', { eager: true })
const sketchConfigs = import.meta.glob('./sketches/*/config.ts', { eager: true })

export const getSketchModuleItems = () =>
  Object.keys(sketchModules).map((path) => {
    // Extract sketch ID from path: './sketches/logo/index.ts' -> 'logo'
    const sketchId = path.match(/\.\/sketches\/(.+)\/index\.ts/)?.[1]

    if (!sketchId) {
      throw new Error(`Could not extract sketch ID from path: ${path}`)
    }

    const module = (sketchModules[path] as { default: unknown }).default
    const configPath = `./sketches/${sketchId}/config.ts`
    const config = sketchConfigs[configPath]
      ? (sketchConfigs[configPath] as { default: unknown }).default
      : {}

    return {
      moduleId: sketchId,
      module,
      config: processConfig(config as Record<string, unknown>, { fallBackTitle: sketchId }),
    }
  })
