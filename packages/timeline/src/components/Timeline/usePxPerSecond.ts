import { useCallback, useRef, type RefObject } from 'react'

interface UsePxPerSecondParams {
  bodyRef: RefObject<HTMLDivElement>
  durationMs: number
  playheadPositionMs: number
  initialPxPerSecond: number
}

export const usePxPerSecond = ({
  bodyRef,
  durationMs,
  playheadPositionMs,
  initialPxPerSecond,
}: UsePxPerSecondParams) => {
  const pxPerSecondRef = useRef(initialPxPerSecond)
  const durationSec = durationMs / 1000

  // Re-centers the scroll pane on the playhead if it's visible, otherwise on whatever time was
  // centered before pxPerSecond changed, instead of always zooming from the start of the timeline.
  // Mutates the DOM directly (bypassing React state) so the scroll position can be adjusted in the
  // same tick as the resize, without waiting on an effect.
  const setPxPerSecond = useCallback(
    (nextPxPerSecond: number) => {
      const body = bodyRef.current
      if (!body) return

      const trackHeaderWidth =
        parseFloat(getComputedStyle(body).getPropertyValue('--trackHeaderWidth')) || 0
      const prevTrackAreaWidth = durationSec * pxPerSecondRef.current

      const playheadX = trackHeaderWidth + (playheadPositionMs / durationMs) * prevTrackAreaWidth
      const isPlayheadVisible =
        playheadX >= body.scrollLeft + trackHeaderWidth &&
        playheadX <= body.scrollLeft + body.clientWidth

      const centerFraction = isPlayheadVisible
        ? playheadPositionMs / durationMs
        : prevTrackAreaWidth > 0
          ? (body.scrollLeft + body.clientWidth / 2 - trackHeaderWidth) / prevTrackAreaWidth
          : 0

      const nextTrackAreaWidth = durationSec * nextPxPerSecond
      body.style.setProperty('--trackAreaWidth', `${nextTrackAreaWidth}px`)
      body.scrollLeft =
        trackHeaderWidth + centerFraction * nextTrackAreaWidth - body.clientWidth / 2

      pxPerSecondRef.current = nextPxPerSecond
    },
    [bodyRef, durationMs, durationSec, playheadPositionMs],
  )

  return { pxPerSecond: pxPerSecondRef.current, setPxPerSecond }
}
