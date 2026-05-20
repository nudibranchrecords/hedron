import { useCallback } from 'react'
import type { ReactElement } from 'react'

import c from './styles.module.css'
import { Vector2ScrubOverlay } from './Vector2ScrubOverlay'
import { engine } from '@renderer/engine'

export const Viewer = (): ReactElement => {
  const containerRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      engine.createCanvas(node)
    }
  }, [])

  return (
    <div className={c.wrapper}>
      <div ref={containerRef}></div>

      <Vector2ScrubOverlay />
    </div>
  )
}
