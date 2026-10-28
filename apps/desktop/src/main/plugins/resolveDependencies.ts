import type { DiscoveredPlugin } from './discoverPlugins'
import type { DependencyIssue } from '@shared/PluginEvents'
import { satisfiesRange, sortByDependencies } from '@shared/pluginDependencies'

const requiredIds = (plugin: DiscoveredPlugin) => Object.keys(plugin.manifest.dependencies ?? {})

export const dependencyIds = (plugin: DiscoveredPlugin) => [
  ...requiredIds(plugin),
  ...Object.keys(plugin.manifest.optionalDependencies ?? {}),
]

/** Orders plugins after the plugins they depend on and finds what stops each one loading. */
export const resolveDependencies = (
  plugins: DiscoveredPlugin[],
  isEnabled: (id: string) => boolean,
) => {
  const byId = new Map(plugins.map((plugin) => [plugin.id, plugin] as const))
  const issues = new Map<DiscoveredPlugin, DependencyIssue[]>()
  const addIssue = (plugin: DiscoveredPlugin, issue: DependencyIssue) => {
    issues.set(plugin, [...(issues.get(plugin) ?? []), issue])
  }

  // Only required dependencies can deadlock; optional ones in a loop just load in either order
  for (const cycle of sortByDependencies(plugins, (p) => p.id, requiredIds).cycles) {
    for (let i = 0; i < cycle.length - 1; i++) {
      addIssue(byId.get(cycle[i])!, {
        id: cycle[i + 1],
        reason: 'cycle',
        optional: false,
        message: `Dependency cycle: ${cycle.join(' → ')}`,
      })
    }
  }

  const { order } = sortByDependencies(plugins, (p) => p.id, dependencyIds)
  const loadable = new Set<string>()

  for (const plugin of order) {
    const inCycle = !!issues.get(plugin)?.some((issue) => issue.reason === 'cycle')

    const check = (id: string, range: string, optional: boolean) => {
      const add = (reason: DependencyIssue['reason'], message: string) =>
        addIssue(plugin, { id, reason, optional, message })
      const dependency = byId.get(id)
      const label = !dependency || dependency.name === id ? `"${id}"` : `${dependency.name} (${id})`

      // An absent optional dependency is fine, but one at the wrong version is worth a warning
      if (!dependency) {
        if (!optional) add('missing', `Requires ${label} ${range}, which isn't installed`)
      } else if (!isEnabled(id)) {
        if (!optional) add('disabled', `Requires ${label}, which is disabled`)
      } else if (!satisfiesRange(dependency.version, range)) {
        add(
          'version',
          `${optional ? 'Works with' : 'Requires'} ${label} ${range}, but ${dependency.version} is installed`,
        )
      } else if (!optional && !inCycle && !loadable.has(id)) {
        add('unloadable', `Requires ${label}, which can't load`)
      }
    }

    for (const [id, range] of Object.entries(plugin.manifest.dependencies ?? {})) {
      check(id, range, false)
    }
    for (const [id, range] of Object.entries(plugin.manifest.optionalDependencies ?? {})) {
      check(id, range, true)
    }

    const blocked = issues.get(plugin)?.some((issue) => !issue.optional)
    if (plugin.errors.length === 0 && isEnabled(plugin.id) && !blocked) loadable.add(plugin.id)
  }

  return { order, issues, loadable }
}
