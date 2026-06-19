import { useElementScrub } from '@hedron-gl/ui-core'
import { useCallback, useEffect, useRef } from 'react'

export const usePlayheadScrub = (
  durationMs: number,
  playheadAreaRef: React.RefObject<HTMLDivElement>,
  onPlayheadChange?: (time: number) => void,
) => {
  // We need this as a ref for useElementScrub to work properly
  const playheadPositionRef = useRef(0)

  const onPlayheadAreaScrub = useCallback(
    ({ x }: { x: number }) => {
      const newTime = playheadPositionRef.current + x * durationMs

      onPlayheadChange?.(newTime)
      playheadPositionRef.current = newTime
    },
    [durationMs, onPlayheadChange],
  )

  const onRulerMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!playheadAreaRef.current || !onPlayheadChange) return
      const rect = playheadAreaRef.current.getBoundingClientRect()

      const x = e.clientX - rect.left

      if (x < 0) return

      const time = (x / rect.width) * durationMs
      onPlayheadChange(time)
      playheadPositionRef.current = time
    },
    [durationMs, onPlayheadChange, playheadAreaRef],
  )

  useEffect(() => {
    const current = playheadAreaRef.current
    current?.addEventListener('mousedown', onRulerMouseDown)
    return () => {
      current?.removeEventListener('mousedown', onRulerMouseDown)
    }
  }, [onRulerMouseDown, playheadAreaRef])

  useElementScrub(playheadAreaRef, onPlayheadAreaScrub, 'ew-resize')
}
