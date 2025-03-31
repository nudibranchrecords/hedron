import { EngineState, Node, NodeWithInfo } from '@store/types'

function isNodeShotBase(input: Node): boolean {
  return input.type === 'shot'
}

export const getSketchNodeWithInfo =
  (nodeId: string) =>
  (state: EngineState): NodeWithInfo | null => {
    const node: Node = state.params[nodeId] ?? state.shots[nodeId]
    if (!node) return null

    const sketch = state.sketches[node.sketchId]
    if (!sketch) return null

    const module = state.sketchModules[sketch.moduleId]
    if (!module) return null

    let paramConfig, title
    if (isNodeShotBase(node)) {
      const paramIndex = sketch.shotIds.indexOf(nodeId)
      paramConfig = module.config.shots[paramIndex]
      title = paramConfig?.title ?? paramConfig?.method
    } else {
      const paramIndex = sketch.paramIds.indexOf(nodeId)
      paramConfig = module.config.params[paramIndex]
      title = paramConfig?.title ?? paramConfig?.key
    }

    return { ...node, title }
  }
