import { useEngineStoreDeepEqual } from '@hedron-gl/ui-core'

import { DEFAULT_TIMELINE_ID } from '@/constants'
import { getTimelineTracks } from '@/selectors/getTimelineTracks'

export const useTimelineTracks = () =>
  useEngineStoreDeepEqual((state) => getTimelineTracks(state, DEFAULT_TIMELINE_ID))
