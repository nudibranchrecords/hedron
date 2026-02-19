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

        const vec2 = [x, y]

        selectedNode.childNodeIds.forEach((id, i) => {
          const oldVal = nodeValues[id] as number
          const sliderMin = (nodeValues[`${id}-sliderMin`] as number | undefined) ?? 0
          const sliderMax = (nodeValues[`${id}-sliderMax`] as number | undefined) ?? 1
          const range = sliderMax - sliderMin

          const nextValue = oldVal + vec2[i] * range
          const clampedValue = Math.min(Math.max(nextValue, sliderMin), sliderMax)
          updateNodeValue(id, clampedValue)
        })
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
