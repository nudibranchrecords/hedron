import { getParamWithInfo } from '@hedron/engine'
import { useAppStore } from '@renderer/appStore'
import { useActiveSketch } from '@components/hooks/useActiveSketch'
import { useEngineStore } from '@renderer/engine'
import { ParamWithInfo } from '@components/hooks/useActiveSketchParams'

export const useSelectedParam = (): ParamWithInfo | null => {
  const activeSketch = useActiveSketch()

  if (!activeSketch) {
    throw new Error('useSelectedParam hook: No active sketch found')
  }

  const selectedNodeId = useAppStore((state) => state.selectedNodes[activeSketch.id])
  return useEngineStore(getParamWithInfo(selectedNodeId))
}
