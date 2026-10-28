# @hedron-gl/plugin-sdk

Hedron plugins can live outside the Hedron repo, in their own git repo (public or private) or any
folder, and load at runtime. This package holds the contract between a plugin and Hedron.

## Loading a plugin

- **User plugins:** open the **Plugins** panel and choose **Add plugin folder**. The folder can be
  a plugin itself, or a folder of plugin folders. Git is not involved; clone a repo anywhere and
  add that folder.
- **Project plugins:** put plugins in a `plugins` folder beside the project's `sketches` folder.
  Hedron asks before running them the first time, since opening a project shouldn't silently run
  someone else's code.

Hedron bundles each plugin with esbuild when it loads and rebuilds it when its files change, so
there's no build step. A plugin with npm dependencies needs `npm install` / `pnpm install` run in
its folder first.

Plugins run with full access to the machine. Only load plugins you trust.

## Layout

```
my-plugin/
  package.json
  src/index.ts   ← renderer entry
  src/main.ts    ← optional Electron main process entry
```

```jsonc
// package.json
{
  "name": "my-plugin",
  "displayName": "My Plugin",
  "version": "0.1.0",
  "hedron": {
    "id": "my-plugin",
    "apiVersion": 1,
    "renderer": "src/index.ts",
    "main": "src/main.ts",
    // Packages the main entry loads from node_modules instead of bundling, e.g. native addons
    "mainExternals": ["usb"],
    // Other plugins, by id, that load before this one
    "dependencies": { "dmx-lighting": "^0.1.0" },
    "optionalDependencies": { "midi-tools": "~1.2.0" },
  },
}
```

### Dependencies

A plugin whose `dependencies` aren't all installed, enabled and in range doesn't load; the Plugins
panel says why. `optionalDependencies` only order loading, and warn when present at a version out
of range. Ranges are `^1.2.3`, `~1.2.3`, an exact `1.2.3`, or `*`, checked against each plugin's
package.json `version`.

## Renderer entry

```tsx
import { definePlugin, type PluginContext } from '@hedron-gl/plugin-sdk'
import type { IPlugin } from '@hedron-gl/engine'

class MyPlugin implements IPlugin {
  id = 'my-plugin'
  name = 'My Plugin'
  iconName = 'extension'
  description = 'Does a thing'

  constructor(private ctx: PluginContext) {}

  update() {
    // Runs every frame
  }

  dispose() {
    // Release timers and listeners; called on disable and hot reload
  }
}

export default definePlugin({
  create: (ctx) => new MyPlugin(ctx),
  views: {
    globalPanel: ({ engine }) => <div>Shown in the plugin panel list</div>,
    inputPanel: { 'my-input-type': ({ input }) => <div>{input.title}</div> },
    sketchCollapsible: ({ sketchId }) => <div>Shown under each sketch</div>,
  },
  // Sketches and other plugins can `import { ping } from '@hedron-plugins/my-plugin'`
  api: (plugin) => ({ ping: () => 'pong' }),
})
```

`ctx` gives the plugin:

|                               |                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `ctx.engine`                  | the Hedron engine and its store                                                                 |
| `ctx.main.invoke / send / on` | messages to and from the plugin's main entry, namespaced to the plugin                          |
| `ctx.storage.read / write`    | files in Hedron's user data folder, for state that belongs to the machine rather than a project |
| `ctx.getPlugin(id)`           | another loaded plugin                                                                           |

Project state belongs in engine nodes (param values or `customData`), which save with the project.

### Shared modules

These imports resolve to Hedron's own copies at runtime rather than being bundled, so hooks,
context and `instanceof` work across the boundary. Install them as dev dependencies for types only:

`react`, `react-dom`, `react/jsx-runtime`, `zustand`, `@hedron-gl/engine`, `@hedron-gl/ui-core`,
`@hedron-gl/app-store`, `@hedron-gl/plugin-sdk`, `three`, `three/webgpu`, `three/tsl`,
`postprocessing`. The full list is `SHARED_MODULES`.

## Main entry

For anything the renderer can't do: USB, serial, UDP, the file system.

```ts
import { defineMainPlugin } from '@hedron-gl/plugin-sdk'

export default defineMainPlugin({
  activate: (ctx) => {
    ctx.handle('getStatus', () => 'ok') // answers ctx.main.invoke('getStatus')
    ctx.on('write', (bytes) => {}) // receives ctx.main.send('write', bytes)
    ctx.send('event', 1) // reaches ctx.main.on('event') in the renderer

    // Optional cleanup; IPC handlers are removed automatically
    return () => {}
  },
})
```

The main entry is bundled to CommonJS and run as if it lived in the plugin folder, so
`mainExternals` resolve from the plugin's own `node_modules`. Native addons built with N-API (such
as `usb` or `serialport`) work without rebuilding for Electron.
