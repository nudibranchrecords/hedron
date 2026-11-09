import type * as esbuild from 'esbuild'
import { PLUGIN_API_PREFIX } from '@hedron-gl/plugin-sdk'

const filter = new RegExp(`^${PLUGIN_API_PREFIX.replace(/[/@]/g, '\\$&')}(.+)$`)

/** Resolves `@hedron-plugins/<id>`, in sketch and plugin bundles alike, to the stable object that plugin's `api` fills. */
export const pluginApiResolver: esbuild.Plugin = {
  name: 'hedron-plugin-api-resolver',
  setup: (build) => {
    build.onResolve({ filter }, (args) => ({
      path: args.path.slice(PLUGIN_API_PREFIX.length),
      namespace: 'hedron-plugin-api',
    }))
    build.onLoad({ filter: /.*/, namespace: 'hedron-plugin-api' }, (args) => {
      const id = JSON.stringify(args.path)
      return {
        contents: `var apis = (window.__HEDRON.pluginApis ??= {}); module.exports = (apis[${id}] ??= {})`,
        loader: 'js',
      }
    })
  },
}
