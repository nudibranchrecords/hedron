import { TimelineManagerKeyframeTrack, TimelineManagerTrack } from '@/types'

/** Flattens a track tree (sketch groups and vectors) down to the keyframe tracks it contains. */
export const getKeyframeTracks = (
  tracks: TimelineManagerTrack[],
): TimelineManagerKeyframeTrack[] => {
  const keyframeTracks: TimelineManagerKeyframeTrack[] = []

  for (const track of tracks) {
    if (track.trackType === 'keyframe') {
      keyframeTracks.push(track)
      continue
    }

    if (track.trackType === 'vector' || track.trackType === 'sketch') {
      keyframeTracks.push(...getKeyframeTracks(track.childTracks))
    }
  }

  return keyframeTracks
}
