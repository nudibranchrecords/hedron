import { TimelineManagerTrack } from '@/types'

export const findTrackById = (
  trackList: TimelineManagerTrack[],
  trackId: string,
): TimelineManagerTrack | null => {
  for (const track of trackList) {
    if (track.id === trackId) {
      return track
    }

    if (track.trackType === 'vector') {
      const childTrack = findTrackById(track.childTracks, trackId)
      if (childTrack) {
        return childTrack
      }
    }
  }

  return null
}
