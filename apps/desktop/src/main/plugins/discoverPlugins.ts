import fs from 'fs'
import path from 'path'
import { PLUGIN_API_VERSION, type PluginManifest } from '@hedron-gl/plugin-sdk'
import { isValidPluginId, PluginSource } from '@shared/PluginEvents'
import { parseVersionRange } from '@shared/pluginDependencies'

export interface DiscoveredPlugin {
  id: string
  name: string
  version: string
  description: string
  dir: string
  /** Usually one; both when a project plugin's folder was also added as a user folder. */
  sources: PluginSource[]
  /** Set on a user copy that a project's own copy of the same plugin replaces. */
  overriddenBy: string | null
  manifest: PluginManifest
  rendererEntry: string | null
  mainEntry: string | null
  /** Problems that stop the plugin from loading at all. */
  errors: string[]
}

const readPackageJson = (dir: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
  } catch {
    return null
  }
}

const resolveEntry = (dir: string, entry: unknown, errors: string[], label: string) => {
  if (entry === undefined) return null
  if (typeof entry !== 'string') {
    errors.push(`"hedron.${label}" must be a path`)
    return null
  }

  const absolute = path.resolve(dir, entry)
  // An entry must live inside its plugin folder
  if (!absolute.startsWith(path.resolve(dir) + path.sep)) {
    errors.push(`"hedron.${label}" points outside the plugin folder`)
    return null
  }
  if (!fs.existsSync(absolute)) {
    errors.push(`${label} entry not found: ${entry}`)
    return null
  }
  return absolute
}

const readDependencies = (value: unknown, errors: string[], label: string) => {
  const dependencies: Record<string, string> = {}
  if (value === undefined) return dependencies
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`"hedron.${label}" must map plugin ids to version ranges`)
    return dependencies
  }

  for (const [id, range] of Object.entries(value)) {
    if (!isValidPluginId(id)) {
      errors.push(`"hedron.${label}" has an invalid plugin id: "${id}"`)
    } else if (typeof range !== 'string' || !parseVersionRange(range)) {
      errors.push(`"hedron.${label}.${id}" must be a version like "^1.2.3", "~1.2.3" or "1.2.3"`)
    } else {
      dependencies[id] = range
    }
  }
  return dependencies
}

const readPlugin = (dir: string, source: PluginSource): DiscoveredPlugin | null => {
  const pkg = readPackageJson(dir)
  const hedron = pkg?.hedron as Partial<PluginManifest> | undefined
  if (!pkg || !hedron || typeof hedron !== 'object') return null

  const errors: string[] = []
  const folderName = path.basename(dir)
  const id = isValidPluginId(hedron.id) ? hedron.id : folderName

  if (!isValidPluginId(hedron.id)) {
    errors.push(`"hedron.id" is missing or invalid (letters, numbers, ".", "_" and "-" only)`)
  }
  if (typeof hedron.apiVersion !== 'number') {
    errors.push(`"hedron.apiVersion" is missing`)
  } else if (hedron.apiVersion > PLUGIN_API_VERSION) {
    errors.push(
      `Needs plugin API v${hedron.apiVersion}, this Hedron supports v${PLUGIN_API_VERSION}`,
    )
  }

  const rendererEntry = resolveEntry(dir, hedron.renderer, errors, 'renderer')
  const mainEntry = resolveEntry(dir, hedron.main, errors, 'main')
  if (!hedron.renderer && !hedron.main) {
    errors.push('Plugin has neither a "hedron.renderer" nor a "hedron.main" entry')
  }

  const dependencies = readDependencies(hedron.dependencies, errors, 'dependencies')
  const optionalDependencies = readDependencies(
    hedron.optionalDependencies,
    errors,
    'optionalDependencies',
  )
  if (id in dependencies || id in optionalDependencies) {
    errors.push("A plugin can't depend on itself")
  }

  return {
    id,
    name: typeof pkg.displayName === 'string' ? pkg.displayName : String(pkg.name ?? id),
    version: String(pkg.version ?? '0.0.0'),
    description: String(pkg.description ?? ''),
    dir,
    sources: [source],
    overriddenBy: null,
    manifest: {
      id,
      apiVersion: hedron.apiVersion ?? 0,
      renderer: hedron.renderer,
      main: hedron.main,
      mainExternals: Array.isArray(hedron.mainExternals) ? hedron.mainExternals : [],
      dependencies,
      optionalDependencies,
    },
    rendererEntry,
    mainEntry,
    errors,
  }
}

/** A folder is either a plugin itself or a collection of plugin folders one level down. */
export const discoverPluginsInFolder = (rawFolder: string, source: PluginSource) => {
  const folder = path.resolve(rawFolder)
  if (!fs.existsSync(folder)) return []

  const self = readPlugin(folder, source)
  if (self) return [self]

  const found: DiscoveredPlugin[] = []
  for (const dirent of fs.readdirSync(folder, { withFileTypes: true })) {
    if (!dirent.isDirectory() || dirent.name.startsWith('.') || dirent.name === 'node_modules') {
      continue
    }
    const plugin = readPlugin(path.join(folder, dirent.name), source)
    if (plugin) found.push(plugin)
  }
  return found
}
