import { useCallback } from 'react'
import c from './styles.module.css'
import { createCanvas } from 'src/engine/3d/renderer'

export const Viewer = (): JSX.Element => {
  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      createCanvas(node)
    }
  }, [])

  return <div ref={containerRef} className={c.wrapper}></div>
}
