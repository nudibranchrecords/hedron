import { ControlGrid, Collapsible, HedronErrorBoundary, Icon, IconName } from '@hedron-gl/ui-core'
import { ComponentType, useState } from 'react'
import { ShotNode, ParamNode } from '@hedron-gl/engine'
import c from './SketchControls.module.css'
import { useAppStore } from '@renderer/appStore'
import { engine, pluginViews } from '@renderer/engine'

const SketchPluginCollapsibles = ({ sketchId }: { sketchId: string }) => {
  const [openById, setOpenById] = useState<Record<string, boolean>>({})

  return (
    <>
      {Object.entries(pluginViews.sketchCollapsible).map(([pluginId, PluginPanel]) => {
        const enginePlugin = engine.plugins[pluginId]
        const pluginName = enginePlugin?.name ?? pluginId
        const iconName = (enginePlugin?.iconName ?? 'extension') as IconName
        const isOpen = openById[pluginId] ?? false

        return (
          <div key={pluginId} className="mb-xl">
            <Collapsible
              title={
                <>
                  <Icon name={iconName} /> {pluginName}
                </>
              }
              isOpen={isOpen}
              onToggle={(nextOpen) =>
                setOpenById((prev) => ({
                  ...prev,
                  [pluginId]: nextOpen,
                }))
              }
            >
              <PluginPanel sketchId={sketchId} engine={engine} />
            </Collapsible>
          </div>
        )
      })}
    </>
  )
}

interface SketchControlsProps {
  sketchId: string
  nodeGroups: {
    groupTitle: string
    groupIndex: number
    children: (ParamNode | ShotNode)[]
  }[]
  ControlItem: ComponentType<{ node: ParamNode | ShotNode; sketchId: string }>
}

const EMPTY_OBJECT = {} as Record<number, boolean>

export const SketchControls = ({ sketchId, nodeGroups, ControlItem }: SketchControlsProps) => {
  const openedControlGroups =
    useAppStore((state) => state.openedControlGroups[sketchId]) ?? EMPTY_OBJECT
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

        <SketchPluginCollapsibles sketchId={sketchId} />
      </div>
    </HedronErrorBoundary>
  )
}
