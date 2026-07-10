import { useMemo } from 'react'

import { useEngineStoreDeepEqual } from '@hedron-gl/ui-core'

import { DEFAULT_TIMELINE_ID, TIMELINE_DURATION } from '@/constants'
import { getTimelineTracks } from '@/selectors/getTimelineTracks'

export const useTimelineData = () => {
  const tracks = useEngineStoreDeepEqual((state) => getTimelineTracks(state, DEFAULT_TIMELINE_ID))

  return useMemo(() => {
    return {
      tracks,
      durationMs: TIMELINE_DURATION,
    }
  }, [tracks])
}
