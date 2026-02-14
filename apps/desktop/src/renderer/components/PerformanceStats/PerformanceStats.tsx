import { useEffect, useRef } from 'react'
import { performanceMonitor } from '@renderer/engine'

export const PerformanceStats = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(performanceMonitor.dom)
      performanceMonitor.dom.setAttribute('style', '')
    }

    return () => {
      performanceMonitor.dom.remove()
    }
  }, [])

  return <div ref={ref} />
}
