import os from 'os'
import path from 'path'
import { app } from 'electron'
import type * as esbuild from 'esbuild'
import { SHARED_MODULES } from '@hedron-gl/plugin-sdk'
import type { DiscoveredPlugin } from './discoverPlugins'
import { loadEsbuild } from '@main/getUnpackedModules'

export interface BuildOutput {
  /** Output files keyed by path relative to the build's outdir, using forward slashes. */
  files: Map<string, Uint8Array>
  errors: string[]
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

const SHARED_FILTER = new RegExp(`^(?:${SHARED_MODULES.map(escapeRegExp).join('|')})$`)

/**
 * Points shared imports at the host's own instances. The stand-in is CommonJS so esbuild's
 * interop handles default and named imports without us listing every export.
 */
const sharedModulesPlugin: esbuild.Plugin = {
  name: 'hedron-shared-modules',
  setup: (build) => {
    build.onResolve({ filter: SHARED_FILTER }, (args) => ({
      path: args.path,
      namespace: 'hedron-shared',
    }))
    build.onLoad({ filter: /.*/, namespace: 'hedron-shared' }, (args) => ({
      contents: `module.exports = window.__HEDRON.modules[${JSON.stringify(args.path)}]`,
      loader: 'js',
    }))
  },
}

const ASSET_LOADERS: Record<string, esbuild.Loader> = {
  '.png': 'file',
  '.jpg': 'file',
  '.jpeg': 'file',
  '.gif': 'file',
  '.svg': 'file',
  '.ttf': 'file',
  '.otf': 'file',
  '.woff': 'file',
  '.woff2': 'file',
  '.glsl': 'text',
  '.frag': 'text',
  '.vert': 'text',
  '.md': 'text',
}

const formatMessage = (message: esbuild.Message) => {
  const location = message.location
    ? `${message.location.file}:${message.location.line}:${message.location.column} `
    : ''
  return `${location}${message.text}`
}

// Builds are never written, but esbuild still needs an outdir to lay out relative paths
const virtualOutdir = (pluginId: string, kind: string) =>
  path.join(os.tmpdir(), 'hedron-plugin-builds', pluginId, kind)

const toOutput = (result: esbuild.BuildResult, outdir: string): BuildOutput => {
  const files = new Map<string, Uint8Array>()
  for (const file of result.outputFiles ?? []) {
    files.set(path.relative(outdir, file.path).split(path.sep).join('/'), file.contents)
  }
  return { files, errors: result.errors.map(formatMessage) }
}

/**
 * Starts a watching build and resolves once the first build (and its handler) has finished.
 * Later rebuilds call `onBuild` again.
 */
const watchBuild = async (
  options: esbuild.BuildOptions & { outdir: string },
  onBuild: (output: BuildOutput, isFirst: boolean) => Promise<void> | void,
) => {
  const esbuild = await loadEsbuild()
  let isFirst = true
  let resolveFirst: () => void
  const firstBuild = new Promise<void>((resolve) => (resolveFirst = resolve))

  const ctx = await esbuild.context({
    ...options,
    write: false,
    bundle: true,
    logLevel: 'silent',
    plugins: [
      ...(options.plugins ?? []),
      {
        name: 'hedron-plugin-on-end',
        setup: (build) => {
          build.onEnd(async (result) => {
            const wasFirst = isFirst
            isFirst = false
            try {
              await onBuild(toOutput(result, options.outdir), wasFirst)
            } finally {
              if (wasFirst) resolveFirst()
            }
          })
        },
      },
    ],
  })

  await ctx.watch()
  await firstBuild
  return ctx
}

export const watchRendererBuild = (
  plugin: DiscoveredPlugin,
  publicPath: string,
  onBuild: (output: BuildOutput, isFirst: boolean) => Promise<void> | void,
) => {
  const outdir = virtualOutdir(plugin.id, 'renderer')
  return watchBuild(
    {
      entryPoints: { index: plugin.rendererEntry! },
      outdir,
      format: 'esm',
      platform: 'browser',
      target: 'es2022',
      sourcemap: 'inline',
      jsx: 'automatic',
      loader: ASSET_LOADERS,
      assetNames: 'assets/[name]-[hash]',
      publicPath,
      define: {
        'process.env.NODE_ENV': JSON.stringify(app.isPackaged ? 'production' : 'development'),
      },
      plugins: [sharedModulesPlugin],
    },
    onBuild,
  )
}

export const watchMainBuild = (
  plugin: DiscoveredPlugin,
  onBuild: (output: BuildOutput, isFirst: boolean) => Promise<void> | void,
) => {
  const outdir = virtualOutdir(plugin.id, 'main')
  return watchBuild(
    {
      entryPoints: { main: plugin.mainEntry! },
      outdir,
      format: 'cjs',
      platform: 'node',
      target: 'node22',
      sourcemap: 'inline',
      // Resolved at runtime: Electron and the SDK by the host, the rest from the plugin's node_modules
      external: ['electron', '@hedron-gl/plugin-sdk', ...(plugin.manifest.mainExternals ?? [])],
      // A native import() would resolve from Hedron's folder; as require() it goes through the plugin's
      supported: { 'dynamic-import': false },
    },
    onBuild,
  )
}
