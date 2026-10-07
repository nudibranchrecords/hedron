import { collapseOpenIcon, collapseCloseIcon, Icon } from '@hedron-gl/ui-core'
import { useRef, useState } from 'react'
import c from './Timeline.module.css'
import { TrackKeyframes } from './TrackKeyframes'
import { Keyframe } from './Keyframe'
import { TimelineManagerKeyframeTrack, TimelineManagerTrack } from '@/types'

interface TimelineTrackProps {
  selectedTrackId: string | null
  setSelectedTrackId: (trackId: string | null) => void
  track: TimelineManagerTrack
  childTracks?: TimelineManagerTrack[]
  depth: number
  durationMs: number
  selectedKeyframes: string[] | null
  setSelectedKeyframes: (keyframes: string[] | null) => void
  onKeyframeMove: (keyframeId: string, time: number) => void
}

const getChildKeyframeTimes = (track: TimelineManagerTrack): number[] => {
  if (track.trackType === 'keyframe') {
    return track.keyframes.map((kf) => kf.time)
  }

  if (track.trackType === 'vector') {
    const times = track.childTracks.flatMap((childTrack) =>
      childTrack.keyframes.map((kf) => kf.time),
    )
    return Array.from(new Set(times)).sort((a, b) => a - b)
  }

  return []
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
  setSelectedKeyframes,
  onKeyframeMove,
}: TimelineTrackProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const isSelected = track.id === selectedTrackId
  const trackBodyRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div key={track.id} className={`${c.track} ${isSelected ? c.trackSelected : ''}`}>
        <div className={c.trackHeader} style={{ '--depth': depth } as React.CSSProperties}>
          {track.trackType === 'vector' && (
            <Icon
              className={c.collapseIcon}
              name={isExpanded ? collapseCloseIcon : collapseOpenIcon}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
          <button className={c.trackTitle} onClick={() => setSelectedTrackId(track.id)}>
            {track.label}
          </button>
        </div>
        <div className={c.trackBody} ref={trackBodyRef}>
          {track.trackType === 'keyframe' && (
            <TrackKeyframes
              track={track}
              durationMs={durationMs}
              selectedKeyframes={selectedKeyframes}
              setSelectedKeyframes={setSelectedKeyframes}
              containerRef={trackBodyRef}
              onKeyframeMove={onKeyframeMove}
            />
          )}
          {track.trackType === 'vector' &&
            getChildKeyframeTimes(track).map((time, index) => {
              const isSelected = !getKeyframesAtTime(track.childTracks, time).some(
                (kfId) => !selectedKeyframes?.includes(kfId),
              )

              return (
                <Keyframe
                  key={index}
                  id={index.toString()}
                  isSelected={isSelected}
                  time={time}
                  trackDurationMs={durationMs}
                  trackRef={trackBodyRef}
                  onClick={() => {
                    setSelectedKeyframes(getKeyframesAtTime(track.childTracks, time))
                  }}
                  onMove={(newTime) => {
                    for (const kfId of getKeyframesAtTime(track.childTracks, time)) {
                      onKeyframeMove(kfId, newTime)
                    }
                  }}
                />
              )
            })}
        </div>
      </div>
      {track.trackType === 'vector' &&
        isExpanded &&
        track.childTracks.map((childTrack) => (
          <TimelineTrack
            key={childTrack.id}
            selectedTrackId={selectedTrackId}
            setSelectedTrackId={setSelectedTrackId}
            track={childTrack}
            depth={depth + 1}
            durationMs={durationMs}
            selectedKeyframes={selectedKeyframes}
            setSelectedKeyframes={setSelectedKeyframes}
            onKeyframeMove={onKeyframeMove}
          />
        ))}
    </>
  )
}
