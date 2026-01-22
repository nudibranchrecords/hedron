import { ControlGrid, Collapsible, HedronErrorBoundary } from '@hedron-gl/ui-core'
import { ComponentType } from 'react'
import { Node } from '@hedron-gl/engine'
import c from './SketchControls.module.css'
import { useAppStore } from '@renderer/appStore'

interface SketchControlsProps {
  sketchId: string
  nodeGroups: {
    groupTitle: string
    groupIndex: number
    children: Node[]
  }[]
  ControlItem: ComponentType<{ node: Node; sketchId: string }>
}

export const SketchControls = ({ sketchId, nodeGroups, ControlItem }: SketchControlsProps) => {
  const openedControlGroups = useAppStore((state) => state.openedControlGroups[sketchId] ?? {})
  const setOpenedControlGroup = useAppStore((state) => state.setOpenedControlGroup)

  return (
    <HedronErrorBoundary>
      <div className={c.wrapper}>
        {nodeGroups.map(({ groupTitle, groupIndex, children }) => {
          const isOpen = openedControlGroups[groupIndex] ?? true
          const itemCountText = isOpen ? '' : ` (${children.length})`

          const grid = (
            <ControlGrid>
              {children.map((node) => (
                /* unique key is important here! otherwise can get cross talk between params with the same key in different sketches */
                <ControlItem key={`${node.key}${sketchId}`} node={node} sketchId={sketchId} />
              ))}
            </ControlGrid>
          )

          return (
            <div key={groupIndex} className="mb-xl">
              <Collapsible
                title={`${groupTitle}${itemCountText}`}
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
