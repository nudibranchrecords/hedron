import { useCallback } from 'react'
import c from './styles.module.css'
import { engine } from '@renderer/engine'

export const Viewer = (): JSX.Element => {
  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      engine.createCanvas(node)
    }
  }, [])

  return <div ref={containerRef} className={c.wrapper}></div>
}
