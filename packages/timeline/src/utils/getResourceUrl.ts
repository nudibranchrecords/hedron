import { EngineState } from '@hedron-gl/engine'

/** Resolves a resource id (as stored in a `file`-type param) to a playable/fetchable URL. */
export const getResourceUrl = (state: EngineState, resourceId: string): string | null => {
  const resource = state.resources[resourceId]
  if (!resource) return null

  return `${state.resourcesUrl}/${resource.filePath}`
}
