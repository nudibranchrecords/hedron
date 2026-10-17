import { collapseOpenIcon, collapseCloseIcon, Icon } from '@hedron-gl/ui-core'
import { useRef, useState } from 'react'
import c from './Timeline.module.css'
import { TrackKeyframes } from './TrackKeyframes'
import { Keyframe } from './Keyframe'
import {
  Keyframe as KeyframeData,
  KeyframeParam,
  TimelineManagerKeyframeTrack,
  TimelineManagerTrack,
} from '@/types'
import { getKeyframeTracks } from '@/utils/getKeyframeTracks'

interface TimelineTrackProps {
  selectedTrackId: string | null
  setSelectedTrackId: (trackId: string | null) => void
  track: TimelineManagerTrack
  childTracks?: TimelineManagerTrack[]
  depth: number
  durationMs: number
  selectedKeyframes: string[] | null
  selectKeyframes: (keyframeIds: string[], isMultiSelect: boolean) => void
  onSelectionBoxStart: (e: React.MouseEvent) => void
  alignedKeyframeIds: Set<string>
  onKeyframeDragStart: (keyframeIds: string[]) => void
  onKeyframeDragMove: (deltaMs: number) => void
}

const getKeyframeTimes = (tracks: TimelineManagerKeyframeTrack[]): number[] => {
  const times = tracks.flatMap((track) => track.keyframes.map((kf) => kf.time))

  return Array.from(new Set(times)).sort((a, b) => a - b)
}

const getKeyframesAtTime = (tracks: TimelineManagerKeyframeTrack[], time: number): string[] => {
  const keyframeIds: string[] = []

  for (const track of tracks) {
    const kf = track.keyframes.find((kf) => kf.time === time)
    if (kf) {
      keyframeIds.push(kf.id)
    }
  }

  return keyframeIds
}

const valuesEqual = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((component, i) => component === b[i])
  }
  return a === b
}

const isParamKeyframe = (kf: KeyframeData): kf is KeyframeParam => kf.nodeType === 'param'

/** Value held at `time`: the last keyframe at or before it, falling back to the first keyframe. */
const getValueAtTime = (sortedKeyframes: KeyframeParam[], time: number): unknown => {
  let value = sortedKeyframes[0]?.value
  for (const kf of sortedKeyframes) {
    if (kf.time > time) break
    value = kf.value
  }
  return value
}

/** Spans between adjacent keyframe times where the value changes. Vector tracks compare every component. */
const getValueChangeSegments = (
  track: TimelineManagerTrack,
): { startTime: number; endTime: number }[] => {
  const tracks =
    track.trackType === 'keyframe' ? [track] : track.trackType === 'vector' ? track.childTracks : []

  const sortedKeyframesPerTrack = tracks.map((t) =>
    t.keyframes.filter(isParamKeyframe).sort((a, b) => a.time - b.time),
  )
  const times = Array.from(
    new Set(sortedKeyframesPerTrack.flatMap((kfs) => kfs.map((kf) => kf.time))),
  ).sort((a, b) => a - b)

  const segments: { startTime: number; endTime: number }[] = []
  for (let i = 1; i < times.length; i++) {
    const startTime = times[i - 1]
    const endTime = times[i]
    const hasChange = sortedKeyframesPerTrack.some(
      (kfs) => !valuesEqual(getValueAtTime(kfs, startTime), getValueAtTime(kfs, endTime)),
    )
    if (hasChange) segments.push({ startTime, endTime })
  }
  return segments
}

export const TimelineTrack = ({
  selectedTrackId,
  setSelectedTrackId,
  track,
  depth,
  durationMs,
  selectedKeyframes,
  selectKeyframes,
  onSelectionBoxStart,
  alignedKeyframeIds,
  onKeyframeDragStart,
  onKeyframeDragMove,
}: TimelineTrackProps) => {
  const isSketchGroup = track.trackType === 'sketch'
  const childTracks: TimelineManagerTrack[] =
    track.trackType === 'vector' || track.trackType === 'sketch' ? track.childTracks : []
  const isExpandable = childTracks.length > 0

  const [isExpanded, setIsExpanded] = useState<boolean>(isSketchGroup)
  const isSelected = !isSketchGroup && track.id === selectedTrackId
  const trackBodyRef = useRef<HTMLDivElement>(null)

  // Group rows collate every keyframe underneath them, however deeply nested.
  const collatedTracks = getKeyframeTracks(childTracks)

  return (
    <>
      <div
        key={track.id}
        className={`${c.track} ${isSelected ? c.trackSelected : ''}  ${isSketchGroup ? c.trackSketchGroup : ''}`}
      >
        <div className={c.trackHeader} style={{ '--depth': depth } as React.CSSProperties}>
          {isExpandable && (
            <Icon
              className={c.collapseIcon}
              name={isExpanded ? collapseCloseIcon : collapseOpenIcon}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
          <button
            className={c.trackTitle}
            onClick={() => (isSketchGroup ? undefined : setSelectedTrackId(track.id))}
          >
            {track.label}
          </button>
        </div>
        {/* Keyframes stop propagation, so a mousedown landing here is empty lane space. */}
        <div className={c.trackBody} ref={trackBodyRef} onMouseDown={onSelectionBoxStart}>
          {getValueChangeSegments(track).map(({ startTime, endTime }) => (
            <div
              key={`${startTime}-${endTime}`}
              className={c.keyframeLine}
              style={{
                left: `${(startTime / durationMs) * 100}%`,
                width: `${((endTime - startTime) / durationMs) * 100}%`,
              }}
            />
          ))}
          {track.trackType === 'keyframe' && (
            <TrackKeyframes
              track={track}
              durationMs={durationMs}
              selectedKeyframes={selectedKeyframes}
              selectKeyframes={selectKeyframes}
              alignedKeyframeIds={alignedKeyframeIds}
              containerRef={trackBodyRef}
              onKeyframeDragStart={onKeyframeDragStart}
              onKeyframeDragMove={onKeyframeDragMove}
            />
          )}
          {isExpandable &&
            getKeyframeTimes(collatedTracks).map((time, index) => {
              const keyframeIdsAtTime = getKeyframesAtTime(collatedTracks, time)
              const isSelected =
                keyframeIdsAtTime.length > 0 &&
                keyframeIdsAtTime.every((kfId) => selectedKeyframes?.includes(kfId))
              const isAlignedWithPlayhead = keyframeIdsAtTime.some((kfId) =>
                alignedKeyframeIds.has(kfId),
              )

              return (
                <Keyframe
                  key={index}
                  selectionIds={keyframeIdsAtTime}
                  isSelected={isSelected}
                  isAlignedWithPlayhead={isAlignedWithPlayhead}
                  time={time}
                  trackDurationMs={durationMs}
                  trackRef={trackBodyRef}
                  onSelect={({ isMultiSelect }) => {
                    selectKeyframes(keyframeIdsAtTime, isMultiSelect)
                  }}
                  onMoveStart={() => onKeyframeDragStart(keyframeIdsAtTime)}
                  onMove={onKeyframeDragMove}
                />
              )
            })}
        </div>
      </div>
      {isExpanded &&
        childTracks.map((childTrack) => (
          <TimelineTrack
            key={childTrack.id}
            selectedTrackId={selectedTrackId}
            setSelectedTrackId={setSelectedTrackId}
            track={childTrack}
            depth={depth + 1}
            durationMs={durationMs}
            selectedKeyframes={selectedKeyframes}
            selectKeyframes={selectKeyframes}
            onSelectionBoxStart={onSelectionBoxStart}
            alignedKeyframeIds={alignedKeyframeIds}
            onKeyframeDragStart={onKeyframeDragStart}
            onKeyframeDragMove={onKeyframeDragMove}
          />
        ))}
    </>
  )
}
