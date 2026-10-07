import { Keyframe, TimelineManagerKeyframeTrack, TimelineManagerTrack } from '@/types'

export const sortKeyframes = (keyframes: Keyframe[]): Keyframe[] =>
  [...keyframes].sort((a, b) => a.time - b.time)

export const addKeyframe = (keyframes: Keyframe[], keyframe: Keyframe): Keyframe[] =>
  sortKeyframes([...keyframes, keyframe])

export const removeKeyframe = (keyframes: Keyframe[], keyframeId: string): Keyframe[] =>
  keyframes.filter((kf) => kf.id !== keyframeId)

export const setKeyframeTime = (
  keyframes: Keyframe[],
  keyframeId: string,
  time: number,
): Keyframe[] => sortKeyframes(keyframes.map((kf) => (kf.id === keyframeId ? { ...kf, time } : kf)))

/** Applies `fn` to every keyframe track in a track tree, leaving vector/audio tracks structurally intact. */
const mapKeyframeTracks = (
  tracks: TimelineManagerTrack[],
  fn: (track: TimelineManagerKeyframeTrack) => TimelineManagerKeyframeTrack,
): TimelineManagerTrack[] =>
  tracks.map((track) => {
    if (track.trackType === 'keyframe') {
      return fn(track)
    }
    if (track.trackType === 'vector') {
      return {
        ...track,
        childTracks: mapKeyframeTracks(track.childTracks, fn) as TimelineManagerKeyframeTrack[],
      }
    }
    return track
  })

export const insertKeyframeIntoTracks = (
  tracks: TimelineManagerTrack[],
  trackId: string,
  keyframe: Keyframe,
): TimelineManagerTrack[] =>
  mapKeyframeTracks(tracks, (track) =>
    track.id === trackId ? { ...track, keyframes: addKeyframe(track.keyframes, keyframe) } : track,
  )

export const deleteKeyframeFromTracks = (
  tracks: TimelineManagerTrack[],
  keyframeId: string,
): TimelineManagerTrack[] =>
  mapKeyframeTracks(tracks, (track) =>
    track.keyframes.some((kf) => kf.id === keyframeId)
      ? { ...track, keyframes: removeKeyframe(track.keyframes, keyframeId) }
      : track,
  )

export const moveKeyframeInTracks = (
  tracks: TimelineManagerTrack[],
  keyframeId: string,
  time: number,
): TimelineManagerTrack[] =>
  mapKeyframeTracks(tracks, (track) =>
    track.keyframes.some((kf) => kf.id === keyframeId)
      ? { ...track, keyframes: setKeyframeTime(track.keyframes, keyframeId, time) }
      : track,
  )
