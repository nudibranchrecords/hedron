import { EngineNodeContainer } from './EngineNodeContainer'
import { useAppStore } from '@hooks/engineHooks'

import { useOnSelectNode } from '@hooks/useOnSelectNode'

export const NodeContainer = ({ nodeId }: { nodeId: string }) => {
  const selectedSceneId = useAppStore((state) => state.selectedSceneId)
  const selectedSketches = useAppStore((state) => state.selectedSketches)
  const selectedSketchId = selectedSceneId ? selectedSketches[selectedSceneId] : null
  const isActive = useAppStore((state) =>
    selectedSketchId ? state.selectedNodes[selectedSketchId] === nodeId : false,
  )
  const onSelectNode = useOnSelectNode(selectedSketchId, nodeId)

  return <EngineNodeContainer nodeId={nodeId} isActive={isActive} onSelectNode={onSelectNode} />
}

export const NodeParam = NodeContainer
