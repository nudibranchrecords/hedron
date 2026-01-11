import { ControlGrid, Collapsible, HedronErrorBoundary } from '@hedron/ui-core'
import { ComponentType } from 'react'
import { Node } from '@hedron/engine'
import c from './SketchControls.module.css'
import { useAppStore } from '@renderer/appStore'

interface SketchControlsProps {
  sketchId: string
  nodeGroups: {
    groupTitle: string
    groupIndex: number
    children: Node[]
    isUngrouped?: boolean
  }[]
  ControlItem: ComponentType<{ nodeId: string; sketchId: string }>
}

export const SketchControls = ({ sketchId, nodeGroups, ControlItem }: SketchControlsProps) => {
  const openedControlGroups = useAppStore((state) => state.openedControlGroups[sketchId] ?? {})
  const setOpenedControlGroup = useAppStore((state) => state.setOpenedControlGroup)

  return (
    <HedronErrorBoundary>
      <div className={c.wrapper}>
        {nodeGroups.map(({ groupTitle, groupIndex, children, isUngrouped }) => {
          const isOpen = openedControlGroups[groupIndex] ?? true
          const itemCountText = isOpen ? '' : ` (${children.length})`
          const ungroupedTitle = nodeGroups.length > 1 ? 'Params (ungrouped)' : 'Params'
          const title = isUngrouped ? ungroupedTitle : groupTitle

          const grid = (
            <ControlGrid>
              {children.map((node) => (
                /* unique key is important here! otherwise can get cross talk between params with the same key in different sketches */
                <ControlItem key={`${node.key}${sketchId}`} nodeId={node.id} sketchId={sketchId} />
              ))}
            </ControlGrid>
          )

          return (
            <div key={groupIndex} className="mb-xl">
              <Collapsible
                title={`${title}${itemCountText}`}
                isOpen={isOpen}
                onToggle={() => setOpenedControlGroup(sketchId, groupIndex, !isOpen)}
              >
                {grid}
              </Collapsible>
            </div>
          )
        })}
      </div>
    </HedronErrorBoundary>
  )
}
