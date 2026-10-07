import { useCallback, useRef, type RefObject } from 'react'
import { clearGlobalCursor, setGlobalCursor } from '@hedron-gl/ui-core'
import c from './Timeline.module.css'

interface KeyframeProps {
  id: string
  onClick?: (keyframeId: string) => void
  isSelected: boolean
  time: number
  trackDurationMs: number
  trackRef: RefObject<HTMLDivElement>
  onMove?: (time: number) => void
}

export const Keyframe = ({
  onClick,
  isSelected,
  id,
  time,
  trackDurationMs,
  trackRef,
  onMove,
}: KeyframeProps) => {
  const percent = (time / trackDurationMs) * 100

  const isKeyframeSelected = isSelected
  // Tracked in a ref so the document-level move handler always sees the drag's origin, not stale state
  const dragStartRef = useRef<{ screenX: number; time: number } | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!onMove || time === undefined || !trackDurationMs || !trackRef?.current) return

      onClick?.(id)
      e.stopPropagation()

      dragStartRef.current = { screenX: e.screenX, time }
      setGlobalCursor('ew-resize')

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dragStart = dragStartRef.current
        const container = trackRef.current
        if (!dragStart || !container || container.offsetWidth <= 0) return

        const deltaTime =
          ((moveEvent.screenX - dragStart.screenX) / container.offsetWidth) * trackDurationMs
        const newTime = Math.max(0, Math.min(trackDurationMs, dragStart.time + deltaTime))
        onMove(newTime)
      }

      const handleMouseUp = () => {
        dragStartRef.current = null
        clearGlobalCursor()
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [onMove, time, trackDurationMs, trackRef, onClick, id],
  )

  return (
    <div
      key={id}
      className={`${c.keyframe} ${isKeyframeSelected ? c.keyframeSelected : ''}`}
      style={{ left: `${percent}%` }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (!onClick) return
        e.stopPropagation()
        onClick(id)
      }}
    />
  )
}
