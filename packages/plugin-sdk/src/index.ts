import type { ComponentType } from 'react'
import type { HedronEngine, IPlugin, InputNode } from '@hedron-gl/engine'

/** Bumped when the contract below changes in a way existing plugins would break on. */
export const PLUGIN_API_VERSION = 1

/**
 * Import specifiers Hedron provides at runtime. Plugins import these as usual,
 * but get the host's instances rather than bundling their own copies.
 */
export const SHARED_MODULES = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'zustand',
  'zustand/react/shallow',
  '@hedron-gl/engine',
  '@hedron-gl/ui-core',
  '@hedron-gl/app-store',
  '@hedron-gl/plugin-sdk',
  'three',
  'three/webgpu',
  'three/tsl',
  'postprocessing',
] as const

export type SharedModule = (typeof SHARED_MODULES)[number]

/** Sketches import a plugin's `sketchApi` from `${SKETCH_API_PREFIX}<plugin id>`. */
export const SKETCH_API_PREFIX = '@hedron-plugins/'

/** The `hedron` field of a plugin's package.json. */
export interface PluginManifest {
  /** Unique id, also used to namespace IPC channels and storage. */
  id: string
  /** The `PLUGIN_API_VERSION` the plugin was written against. */
  apiVersion: number
  /** Renderer entry, relative to the plugin folder. Its default export is a `definePlugin` result. */
  renderer?: string
  /** Electron main process entry, relative to the plugin folder. Its default export is a `defineMainPlugin` result. */
  main?: string
  /** Packages the main entry requires from the plugin's own node_modules instead of bundling, such as native addons. */
  mainExternals?: string[]
}

/** Talks to the plugin's own main entry; channels are namespaced to the plugin automatically. */
export interface PluginMainBridge {
  invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T>
  send(channel: string, ...args: unknown[]): void
  /** Returns an unsubscribe function. */
  on(channel: string, listener: (...args: unknown[]) => void): () => void
}

/** Per-plugin files in Hedron's user data folder, for state that belongs to the machine rather than a project. */
export interface PluginStorage {
  /** Resolves null when the file doesn't exist. */
  read(name: string): Promise<string | null>
  write(name: string, data: string): Promise<void>
}

export interface PluginContext {
  id: string
  engine: HedronEngine
  main: PluginMainBridge
  storage: PluginStorage
  getPlugin<T extends IPlugin>(id: string): T | undefined
}

export interface GlobalPanelProps {
  engine: HedronEngine
}

export interface InputPanelProps {
  engine: HedronEngine
  input: InputNode
}

export interface SketchPanelProps {
  engine: HedronEngine
  sketchId: string
}

export interface PluginViews {
  /** Shown in the plugin panel list beside the viewer. */
  globalPanel?: ComponentType<GlobalPanelProps>
  /** Keyed by input type, shown when an input of that type is selected. */
  inputPanel?: Record<string, ComponentType<InputPanelProps>>
  /** Shown as a collapsible under every sketch's params. */
  sketchCollapsible?: ComponentType<SketchPanelProps>
}

export interface HedronPluginDefinition<P extends IPlugin = IPlugin> {
  create(ctx: PluginContext): P
  views?: PluginViews
  /** Functions sketches can import from `@hedron-plugins/<id>`. */
  sketchApi?(plugin: P): Record<string, unknown>
}

/** The default export of a plugin's renderer entry. */
export const definePlugin = <P extends IPlugin>(
  definition: HedronPluginDefinition<P>,
): HedronPluginDefinition<P> => definition

export interface PluginMainContext {
  id: string
  /** The plugin's folder. */
  dir: string
  /** Per-plugin folder in Hedron's user data, created on first use. */
  dataDir: string
  /** Answers `ctx.main.invoke(channel)` from the renderer. */
  handle(channel: string, handler: (...args: unknown[]) => unknown): void
  /** Receives `ctx.main.send(channel)` from the renderer. */
  on(channel: string, listener: (...args: unknown[]) => void): void
  /** Delivered to `ctx.main.on(channel)` listeners in the renderer. */
  send(channel: string, ...args: unknown[]): void
}

export type MainDeactivate = () => void | Promise<void>

export interface HedronMainPluginDefinition {
  /** May return a function that releases whatever was acquired; IPC handlers are removed automatically. */
  activate(ctx: PluginMainContext): void | MainDeactivate | Promise<void | MainDeactivate>
}

/** The default export of a plugin's main entry. */
export const defineMainPlugin = (definition: HedronMainPluginDefinition) => definition
