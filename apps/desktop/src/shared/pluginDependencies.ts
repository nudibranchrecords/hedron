type Version = [major: number, minor: number, patch: number, prerelease: string]

const parseVersion = (version: string): Version | null => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9a-z.-]+))?(?:\+[0-9a-z.-]+)?$/i.exec(version.trim())
  return match ? [+match[1], +match[2], +match[3], match[4] ?? ''] : null
}

// A release sorts after its own prereleases
const compareVersions = (a: Version, b: Version) =>
  a[0] - b[0] ||
  a[1] - b[1] ||
  a[2] - b[2] ||
  (a[3] === b[3] ? 0 : !a[3] ? 1 : !b[3] ? -1 : a[3] < b[3] ? -1 : 1)

/** Parses a caret (`^1.2.3`), tilde (`~1.2.3`), exact (`1.2.3`) or `*` range into a matcher, or null if it's none of those. */
export const parseVersionRange = (range: string): ((version: string) => boolean) | null => {
  const trimmed = range.trim()
  if (trimmed === '*' || trimmed === '') return () => true

  const operator = /^[\^~=]/.test(trimmed) ? trimmed[0] : '='
  const base = parseVersion(operator === trimmed[0] ? trimmed.slice(1) : trimmed)
  if (!base) return null

  const [major, minor, patch] = base
  const upper: Version =
    operator === '~'
      ? [major, minor + 1, 0, '']
      : major > 0
        ? [major + 1, 0, 0, '']
        : minor > 0
          ? [0, minor + 1, 0, '']
          : [0, 0, patch + 1, '']

  return (raw) => {
    const version = parseVersion(raw)
    if (!version) return false
    if (operator === '=') return compareVersions(version, base) === 0
    // As in npm, a prerelease only matches a range that names the same version
    if (version[3] && (version[0] !== major || version[1] !== minor || version[2] !== patch)) {
      return false
    }
    return compareVersions(version, base) >= 0 && compareVersions(version, upper) < 0
  }
}

export const satisfiesRange = (version: string, range: string) =>
  parseVersionRange(range)?.(version) ?? false

/** Orders items after the items they depend on, skipping ids outside `items`, and returns each cycle found as the ids along it. */
export const sortByDependencies = <T>(
  items: readonly T[],
  idOf: (item: T) => string,
  dependenciesOf: (item: T) => readonly string[],
) => {
  const byId = new Map(items.map((item) => [idOf(item), item] as const))
  const visited = new Map<string, 'visiting' | 'done'>()
  const path: string[] = []
  const order: T[] = []
  const cycles: string[][] = []

  const visit = (id: string) => {
    const item = byId.get(id)
    const state = visited.get(id)
    if (!item || state === 'done') return
    if (state === 'visiting') {
      cycles.push([...path.slice(path.indexOf(id)), id])
      return
    }

    visited.set(id, 'visiting')
    path.push(id)
    for (const dependency of dependenciesOf(item)) visit(dependency)
    path.pop()
    visited.set(id, 'done')
    order.push(item)
  }

  for (const item of items) visit(idOf(item))
  return { order, cycles }
}
