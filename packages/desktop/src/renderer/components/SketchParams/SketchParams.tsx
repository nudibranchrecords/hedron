import {
  ControlGrid,
  Collapsible,
  Param,
  useOnSelectNode,
  HedronErrorBoundary,
} from '@hedron/ui-core'
import c from './SketchParams.module.css'
import { useActiveSketchParams } from '@components/hooks/useActiveSketchParams'

import { useAppStore } from '@renderer/appStore'

interface SketchParamsProps {
  sketchId: string
}

const ParamItem = ({ paramId, sketchId }: { paramId: string; sketchId: string }) => {
  const isActive = useAppStore((state) => state.selectedNodes[sketchId] === paramId)
  const onSelectNode = useOnSelectNode(sketchId, paramId)

  return <Param onClick={onSelectNode} paramId={paramId} isActive={isActive} />
}

export const SketchParams = ({ sketchId }: SketchParamsProps) => {
  const paramGroups = useActiveSketchParams()
  const openedParamGroups = useAppStore((state) => state.openedParamGroups[sketchId] ?? {})
  const setOpenedParamGroup = useAppStore((state) => state.setOpenedParamGroup)

  return (
    <HedronErrorBoundary>
      <div className={c.wrapper}>
        {paramGroups.map(({ groupTitle, groupIndex, params, isUngrouped }) => {
          const isOpen = openedParamGroups[groupIndex] ?? true
          const itemCountText = isOpen ? '' : ` (${params.length})`
          const title = isUngrouped ? 'Ungrouped' : groupTitle

          const grid = (
            <ControlGrid>
              {params.map((param) => (
                /* unique key is important here! otherwise can get cross talk between params with the same key in different sketches */
                <ParamItem key={`${param.key}${sketchId}`} paramId={param.id} sketchId={sketchId} />
              ))}
            </ControlGrid>
          )

          return (
            <div key={groupIndex} className="mb-xl">
              {paramGroups.length === 1 && isUngrouped ? (
                grid
              ) : (
                <Collapsible
                  title={`${title}${itemCountText}`}
                  isOpen={isOpen}
                  onToggle={() => setOpenedParamGroup(sketchId, groupIndex, !isOpen)}
                >
                  {grid}
                </Collapsible>
              )}
            </div>
          )
        })}
      </div>
    </HedronErrorBoundary>
  )
}
