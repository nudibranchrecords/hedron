import { useElementScrub } from '@hedron-gl/ui-core'
import { useCallback, useEffect, useRef } from 'react'

export const usePlayheadScrub = (
  durationMs: number,
  playheadAreaRef: React.RefObject<HTMLDivElement>,
  playheadPositionMs: number,
  onPlayheadChange?: (time: number) => void,
) => {
  // We need this as a ref for useElementScrub to work properly
  const playheadPositionRef = useRef(0)

  useEffect(() => {
    playheadPositionRef.current = playheadPositionMs
  }, [playheadPositionMs])

  const clampTime = useCallback(
    (time: number) => Math.max(0, Math.min(durationMs, time)),
    [durationMs],
  )

  const onPlayheadAreaScrub = useCallback(
    ({ x }: { x: number }) => {
      const newTime = clampTime(playheadPositionRef.current + x * durationMs)

      onPlayheadChange?.(newTime)
      playheadPositionRef.current = newTime
    },
    [clampTime, durationMs, onPlayheadChange],
  )

  const onRulerMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!playheadAreaRef.current || !onPlayheadChange) return
      const rect = playheadAreaRef.current.getBoundingClientRect()
      if (rect.width <= 0) return

      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
      const time = clampTime((x / rect.width) * durationMs)
      onPlayheadChange(time)
      playheadPositionRef.current = time
    },
    [clampTime, durationMs, onPlayheadChange, playheadAreaRef],
  )

  useEffect(() => {
    const current = playheadAreaRef.current
    current?.addEventListener('mousedown', onRulerMouseDown)
    return () => {
      current?.removeEventListener('mousedown', onRulerMouseDown)
    }
  }, [onRulerMouseDown, playheadAreaRef])

  useElementScrub(playheadAreaRef, onPlayheadAreaScrub, 'ew-resize', 'x')
}
