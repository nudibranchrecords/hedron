import { collapseOpenIcon, collapseCloseIcon, Icon } from '@hedron-gl/ui-core'
import { useRef, useState } from 'react'
import c from './Timeline.module.css'
import { TrackKeyframes } from './TrackKeyframes'
import { Keyframe } from './Keyframe'
import { TimelineManagerKeyframeTrack, TimelineManagerTrack } from '@/types'
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
