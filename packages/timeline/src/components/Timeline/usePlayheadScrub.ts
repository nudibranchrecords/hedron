import { useElementScrub } from '@hedron-gl/ui-core'
import { useCallback, useEffect } from 'react'

export const usePlayheadScrub = (
  durationMs: number,
  playheadAreaRef: React.RefObject<HTMLDivElement>,
  playheadPositionMsRef: React.RefObject<number>,
  onPlayheadChange?: (time: number) => void,
  setPlayheadPositionMs?: (nextPlayheadPositionMs: number) => void,
) => {
  // We need this as a ref for useElementScrub to work properly

  const clampTime = useCallback(
    (time: number) => Math.max(0, Math.min(durationMs, time)),
    [durationMs],
  )

  const onPlayheadAreaScrub = useCallback(
    ({ x }: { x: number }) => {
      const newTime = clampTime(playheadPositionMsRef.current! + x * durationMs)

      onPlayheadChange?.(newTime)
      setPlayheadPositionMs?.(newTime)
    },
    [clampTime, durationMs, onPlayheadChange, playheadPositionMsRef, setPlayheadPositionMs],
  )

  const onRulerMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!playheadAreaRef.current || !onPlayheadChange) return
      const rect = playheadAreaRef.current.getBoundingClientRect()
      if (rect.width <= 0) return

      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
      const time = clampTime((x / rect.width) * durationMs)
      onPlayheadChange(time)
      setPlayheadPositionMs?.(time)
    },
    [clampTime, durationMs, onPlayheadChange, playheadAreaRef, setPlayheadPositionMs],
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
