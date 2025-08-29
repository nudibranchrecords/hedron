import { ControlGrid, Collapsible, Param, useOnSelectNode } from '@hedron/ui-core'
import { Param as ParamType } from '@hedron/engine'
import c from './SketchParams.module.css'
import { useActiveSketchParams } from '@components/hooks/useActiveSketchParams'

import { useAppStore } from '@renderer/appStore'

interface SketchParamsProps {
  sketchId: string
}

const ParamItem = ({ param, sketchId }: { param: ParamType; sketchId: string }) => {
  const isActive = useAppStore((state) => state.selectedNodes[sketchId] === param.id)
  const onSelectNode = useOnSelectNode(sketchId, param.id)

  return <Param key={param.key} onClick={onSelectNode} param={param} isActive={isActive} />
}

export const SketchParams = ({ sketchId }: SketchParamsProps) => {
  const paramGroups = useActiveSketchParams()
  const openedParamGroups = useAppStore((state) => state.openedParamGroups[sketchId] ?? {})
  const setOpenedParamGroup = useAppStore((state) => state.setOpenedParamGroup)

  return (
    <div className={c.wrapper}>
      {paramGroups.map(({ groupTitle, groupIndex, params, isUngrouped }) => {
        const isOpen = openedParamGroups[groupIndex] ?? true
        const itemCountText = isOpen ? '' : ` (${params.length})`
        const title = isUngrouped ? 'Ungrouped' : groupTitle

        const grid = (
          <ControlGrid>
            {params.map((param) => (
              /* unique is important here! otherwise can get cross talk between params with the same key in different sketches */
              <ParamItem key={`${param.key}${sketchId}`} param={param} sketchId={sketchId} />
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
  )
}
