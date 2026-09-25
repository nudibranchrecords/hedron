import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePlayheadScrub } from './usePlayheadScrub'
import { usePxPerSecond } from './usePxPerSecond'
import c from './Timeline.module.css'
import { TimelineTrack } from './TimelineTrack'
import { AlignedKeyframe, TimelineManagerTrack } from '@/types'
import { findTrackById } from '@/utils/findTrackById'

const KEYFRAME_ALIGNMENT_TOLERANCE_PX = 3
const EMPTY_ALIGNED_KEYFRAMES: AlignedKeyframe[] = []

const getAlignedKeyframes = (
  tracks: TimelineManagerTrack[],
  playheadPositionMs: number,
  alignmentToleranceMs: number,
): AlignedKeyframe[] => {
  const alignedKeyframes: AlignedKeyframe[] = []

  for (const track of tracks) {
    if (track.trackType === 'vector') {
      alignedKeyframes.push(
        ...getAlignedKeyframes(track.childTracks, playheadPositionMs, alignmentToleranceMs),
      )
      continue
    }

    if (track.trackType !== 'keyframe') continue

    for (const keyframe of track.keyframes) {
      if (Math.abs(keyframe.time - playheadPositionMs) <= alignmentToleranceMs) {
        alignedKeyframes.push({
          trackId: track.id,
          targetNodeId: track.targetNodeId,
          keyframe,
        })
      }
    }
  }

  return alignedKeyframes
}

export type TimelineHandle = {
  setPxPerSecond: (pxPerSecond: number) => void
}

export interface TimelineProps {
  tracks: TimelineManagerTrack[]
  durationMs: number
  playheadPositionMs: number
  activeTimelineComponentId: string | null
  selectedTrackId: string | null
  setSelectedTrackId: (trackId: string | null) => void
  setActiveTimelineComponentId: (id: string | null) => void
  componentId?: string
  initialPxPerSecond?: number
  onPlayheadChange: (time: number) => void
  onKeyframeDelete: (keyframeId: string) => void
  onKeyframeInsert: (trackId: string, time: number) => void
  onKeyframeMove: (keyframeId: string, time: number) => void
  onPlayPauseToggle: () => void
  isAlignmentEnabled?: boolean
  onAlignedKeyframesChange?: (alignedKeyframes: AlignedKeyframe[]) => void
}

export const Timeline = forwardRef<TimelineHandle, TimelineProps>(function Timeline(
  {
    tracks,
    durationMs,
    playheadPositionMs = 0,
    activeTimelineComponentId,
    selectedTrackId,
    setSelectedTrackId: _setSelectedTrackId,
    componentId: _componentId,
    initialPxPerSecond = 80,
    setActiveTimelineComponentId,
    onPlayheadChange,
    onKeyframeDelete,
    onKeyframeInsert,
    onKeyframeMove,
    onPlayPauseToggle,
    isAlignmentEnabled = true,
    onAlignedKeyframesChange,
  },
  ref,
) {
  const durationSec = durationMs / 1000
  const rulerAreaRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const { pxPerSecond, setPxPerSecond } = usePxPerSecond({
    bodyRef,
    durationMs,
    playheadPositionMs,
    initialPxPerSecond,
  })

  const alignmentToleranceMs = (KEYFRAME_ALIGNMENT_TOLERANCE_PX / pxPerSecond) * 1000

  // To prevent clashing of keyboard events, we need to keep track of which component is the active one
  const fallbackId = useId()
  const componentId = _componentId ?? fallbackId

  const isActiveComponent = componentId === activeTimelineComponentId

  const [selectedKeyframes, _setSelectedKeyframes] = useState<string[] | null>(null)
  const alignedKeyframes = useMemo(
    () =>
      isAlignmentEnabled
        ? getAlignedKeyframes(tracks, playheadPositionMs, alignmentToleranceMs)
        : EMPTY_ALIGNED_KEYFRAMES,
    [isAlignmentEnabled, tracks, playheadPositionMs, alignmentToleranceMs],
  )
  const alignedKeyframeIds = useMemo(
    () => new Set(alignedKeyframes.map(({ keyframe }) => keyframe.id)),
    [alignedKeyframes],
  )

  const setSelectedKeyframes = useCallback(
    (keyframes: string[] | null) => {
      _setSelectedKeyframes(keyframes)

      setActiveTimelineComponentId(componentId)
    },
    [componentId, setActiveTimelineComponentId],
  )

  const setSelectedTrackId = useCallback(
    (trackId: string | null) => {
      _setSelectedTrackId(trackId)

      setActiveTimelineComponentId(componentId)
    },
    [_setSelectedTrackId, componentId, setActiveTimelineComponentId],
  )

  useEffect(() => {
    const getChildKeyframeTrackIds = (track: TimelineManagerTrack): string[] => {
      if (track.trackType === 'keyframe') {
        return [track.id]
      }

      if (track.trackType === 'vector') {
        return track.childTracks.map((track) => track.id)
      }

      return []
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return
      }

      // Play/pause on space
      if (e.key === ' ') {
        e.preventDefault()
        onPlayPauseToggle()
      }

      // Don't handle events below if this component is not active
      if (!isActiveComponent) return

      if (e.key === 'x' && selectedKeyframes) {
        selectedKeyframes.forEach((keyframeId) => {
          onKeyframeDelete(keyframeId)
        })

        setSelectedKeyframes(null)
      }
      if (e.key === 'i' && selectedTrackId) {
        const track = findTrackById(tracks, selectedTrackId)
        if (!track) return

        for (const keyframeTrackId of getChildKeyframeTrackIds(track)) {
          onKeyframeInsert(keyframeTrackId, playheadPositionMs)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    selectedKeyframes,
    onKeyframeDelete,
    playheadPositionMs,
    onKeyframeInsert,
    tracks,
    setSelectedKeyframes,
    isActiveComponent,
    selectedTrackId,
    onPlayPauseToggle,
  ])

  useImperativeHandle(ref, () => ({ setPxPerSecond }), [setPxPerSecond])

  useEffect(() => {
    onAlignedKeyframesChange?.(alignedKeyframes)
  }, [alignedKeyframes, onAlignedKeyframesChange])

  usePlayheadScrub(durationMs, rulerAreaRef, playheadPositionMs, onPlayheadChange)

  const playheadPercent = (playheadPositionMs / durationMs) * 100

  const trackAreaWidth = durationSec * pxPerSecond
  const rulerMarks = []
  const step = durationSec <= 10 ? 1 : durationSec <= 60 ? 5 : 10
  for (let t = 0; t <= durationSec; t += step) {
    const percent = (t / durationSec) * 100
    rulerMarks.push(
      <div key={t} className={c.rulerMark} style={{ left: `${percent}%` }}>
        <span className={c.rulerLabel}>{t}s</span>
      </div>,
    )
  }

  return (
    <div className={c.timeline}>
      <div className={c.header}>
        <span>Timeline</span>
        <span>
          {(playheadPositionMs / 1000).toFixed(1)}s / {durationSec}s
        </span>
      </div>
      <div
        className={c.body}
        ref={bodyRef}
        style={{ '--trackAreaWidth': `${trackAreaWidth}px` } as React.CSSProperties}
      >
        <div className={c.ruler} ref={rulerAreaRef}>
          {rulerMarks}
        </div>
        {tracks.map((track) => (
          <TimelineTrack
            key={track.id}
            selectedTrackId={selectedTrackId}
            setSelectedTrackId={setSelectedTrackId}
            track={track}
            depth={0}
            durationMs={durationMs}
            selectedKeyframes={selectedKeyframes}
            setSelectedKeyframes={setSelectedKeyframes}
            alignedKeyframeIds={alignedKeyframeIds}
            onKeyframeMove={onKeyframeMove}
          />
        ))}
        <div
          className={c.playhead}
          style={{ '--playheadPercent': playheadPercent / 100 } as React.CSSProperties}
        />
      </div>
    </div>
  )
})
