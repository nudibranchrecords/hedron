import { EngineState, SketchNode } from '@store/types'

export const getNodeAncestorSketch = (state: EngineState, nodeId: string): SketchNode | null => {
  const visited = new Set<string>()
  const queue = [nodeId]

  while (queue.length > 0) {
    const currentId = queue.shift()!

    if (visited.has(currentId)) continue
    visited.add(currentId)

    const node = state.nodes[currentId]
    if (!node) continue

    if (node.nodeType === 'sketch') return node

    queue.push(...node.parentIds)
  }

  return null
}
