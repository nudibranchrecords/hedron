import { useCallback, useRef } from 'react'
import { useElementScrub } from '@hedron-gl/ui-core'

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

  const onElementScrub = useCallback(
    (inc: number) => {
      if (
        selectedNode &&
        selectedNode.nodeType === 'param' &&
        selectedNode.valueType === 'vector2'
      ) {
        const storeState = engine.getStore().getState()
        const nodeValues = storeState.nodeValues
        const updateNodeValue = storeState.updateNodeValue

        const values = selectedNode.childNodeIds.map((id) => nodeValues[id] as number)

        updateNodeValue(selectedNode.childNodeIds[0], values[0] + inc)
      }
    },
    [selectedNode],
  )

  useElementScrub(scrubRef, onElementScrub)

  return (
    <div ref={scrubRef}>
      <div ref={containerRef} className={c.wrapper}></div>
    </div>
  )
}
