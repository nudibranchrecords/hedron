import { useCallback, useRef } from 'react'
import { Icon, useElementScrub } from '@hedron-gl/ui-core'

import c from './styles.module.css'
import { useSelectedNode } from '@components/hooks/useSelectedNode'
import { engine } from '@renderer/engine'

export const Viewer = (): JSX.Element => {
  const selectedNode = useSelectedNode()

  const containerRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      engine.createCanvas(node)
    }
  }, [])

  const scrubRef = useRef<HTMLDivElement>(null)

  const isVector2 = selectedNode?.nodeType === 'param' && selectedNode.valueType === 'vector2'

  const onElementScrub = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (isVector2) {
        const storeState = engine.getStore().getState()
        const nodeValues = storeState.nodeValues
        const updateNodeValue = storeState.updateNodeValue

        const values = selectedNode.childNodeIds.map((id) => nodeValues[id] as number)

        updateNodeValue(selectedNode.childNodeIds[0], values[0] + x)
        updateNodeValue(selectedNode.childNodeIds[1], values[1] + y)
      }
    },
    [isVector2, selectedNode],
  )

  useElementScrub(scrubRef, onElementScrub)

  return (
    <div className={c.wrapper}>
      <div ref={containerRef}></div>

      {isVector2 && (
        <div ref={scrubRef} className={c.scrubOverlay}>
          <span>
            <Icon name="drag_pan" />
          </span>
        </div>
      )}
    </div>
  )
}
