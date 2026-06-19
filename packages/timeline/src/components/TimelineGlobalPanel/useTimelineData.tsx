import { useMemo } from 'react'

import { useEngineStoreDeepEqual } from '@hedron-gl/ui-core'

import { DEFAULT_TIMELINE_ID } from '@/constants'
import { getTimelineTracks } from '@/selectors/getTimelineTracks'

const TIMELINE_DURATION = 10000

export const useTimelineData = () => {
  const tracks = useEngineStoreDeepEqual((state) => getTimelineTracks(state, DEFAULT_TIMELINE_ID))

  return useMemo(() => {
    return {
      tracks,
      durationMs: TIMELINE_DURATION,
    }
  }, [tracks])
}
