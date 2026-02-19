import { useCallback, useRef } from 'react'
import { Icon, useElementScrub } from '@hedron-gl/ui-core'

import c from './styles.module.css'
import { useSelectedNode } from '@components/hooks/useSelectedNode'

import { engine } from '@renderer/engine'

/*
  This component is an overlay that appears when a Vector2 param is selected.
  It allows the user to click and drag to change the values of the Vector2 param.
*/
export const Vector2ScrubOverlay = () => {
  const selectedNode = useSelectedNode()

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

  useElementScrub(scrubRef, onElementScrub, 'move')

  return isVector2 ? (
    <div ref={scrubRef} className={c.scrubOverlay}>
      <span>
        <Icon name="drag_pan" />
      </span>
    </div>
  ) : null
}
