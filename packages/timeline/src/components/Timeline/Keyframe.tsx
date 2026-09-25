import { useCallback, useRef, type RefObject } from 'react'
import { clearGlobalCursor, setGlobalCursor } from '@hedron-gl/ui-core'
import c from './Timeline.module.css'

interface KeyframeProps {
  /** Keyframes this element stands for: one on a leaf track, many on a collated group row. */
  selectionIds: string[]
  onSelect?: (options: { isMultiSelect: boolean }) => void
  isSelected: boolean
  isAlignedWithPlayhead: boolean
  time: number
  trackDurationMs: number
  trackRef: RefObject<HTMLDivElement>
  onMoveStart?: () => void
  onMove?: (deltaMs: number) => void
}

export const Keyframe = ({
  onSelect,
  isSelected,
  isAlignedWithPlayhead,
  selectionIds,
  time,
  trackDurationMs,
  trackRef,
  onMoveStart,
  onMove,
}: KeyframeProps) => {
  const percent = (time / trackDurationMs) * 100

  const isKeyframeSelected = isSelected
  // Tracked in a ref so the document-level move handler always sees the drag's origin, not stale state
  const dragStartRef = useRef<{ screenX: number } | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      onSelect?.({ isMultiSelect: e.shiftKey })

      // Shift is a selection gesture, so it shouldn't also start a drag.
      if (e.shiftKey || !onMove || !trackDurationMs || !trackRef?.current) return

      dragStartRef.current = { screenX: e.screenX }
      onMoveStart?.()
      setGlobalCursor('ew-resize')

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dragStart = dragStartRef.current
        const container = trackRef.current
        if (!dragStart || !container || container.offsetWidth <= 0) return

        const deltaMs =
          ((moveEvent.screenX - dragStart.screenX) / container.offsetWidth) * trackDurationMs
        onMove(deltaMs)
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
    [onMove, onMoveStart, trackDurationMs, trackRef, onSelect],
  )

  return (
    <div
      data-keyframe-ids={selectionIds.join(',')}
      className={`${c.keyframe} ${isKeyframeSelected ? c.keyframeSelected : ''} ${isAlignedWithPlayhead ? c.keyframeAligned : ''}`}
      style={{ left: `${percent}%` }}
      onMouseDown={handleMouseDown}
    />
  )
}
