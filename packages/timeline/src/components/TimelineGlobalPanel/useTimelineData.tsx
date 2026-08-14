import { useMemo } from 'react'

import { useEngineStoreDeepEqual, useNodeOptionNodes, useParamValue } from '@hedron-gl/ui-core'

import { DEFAULT_TIMELINE_ID } from '@/constants'
import { getTimelineTracks } from '@/selectors/getTimelineTracks'
import type { TimelineOptionNodes } from '@/TimelineInput'

export const useTimelineData = () => {
  const tracks = useEngineStoreDeepEqual((state) => getTimelineTracks(state, DEFAULT_TIMELINE_ID))
  const optionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const durationSeconds = useParamValue<number>(optionNodes.durationSeconds!.id)

  return useMemo(() => {
    return {
      tracks,
      durationMs: durationSeconds * 1000,
    }
  }, [tracks, durationSeconds])
}
