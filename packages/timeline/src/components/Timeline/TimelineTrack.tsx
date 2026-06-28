import { collapseOpenIcon, Icon, useIsItemOpened, useToggleStore } from '@hedron-gl/ui-core'
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
}: TimelineTrackProps) => {
  const isExpanded = useIsItemOpened(track.id)
  const setIsExpanded = useToggleStore((state) => state.toggleItem)
  const isSelected = track.id === selectedTrackId

  return (
    <>
      <div key={track.id} className={`${c.track} ${isSelected ? c.trackSelected : ''}`}>
        <div className={c.trackHeader} style={{ '--depth': depth } as React.CSSProperties}>
          {track.trackType === 'vector' && (
            <Icon
              className={c.collapseIcon}
              name={isExpanded ? collapseOpenIcon : collapseOpenIcon}
              onClick={() => setIsExpanded(track.id)}
            />
          )}
          <button className={c.trackTitle} onClick={() => setSelectedTrackId(track.id)}>
            {track.label}
          </button>
        </div>
        <div className={c.trackBody}>
          {track.trackType === 'keyframe' && (
            <TrackKeyframes
              track={track}
              durationMs={durationMs}
              selectedKeyframes={selectedKeyframes}
              setSelectedKeyframes={setSelectedKeyframes}
            />
          )}
          {track.trackType === 'vector' &&
            getChildKeyframeTimes(track).map((time, index) => {
              const percent = (time / durationMs) * 100

              const isSelected = !getKeyframesAtTime(track.childTracks, time).some(
                (kfId) => !selectedKeyframes?.includes(kfId),
              )

              return (
                <Keyframe
                  key={index}
                  id={index.toString()}
                  percentPos={percent}
                  isSelected={isSelected}
                  onClick={() => {
                    setSelectedKeyframes(getKeyframesAtTime(track.childTracks, time))
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
          />
        ))}
    </>
  )
}
