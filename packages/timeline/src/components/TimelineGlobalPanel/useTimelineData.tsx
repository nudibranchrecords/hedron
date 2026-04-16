import { useMemo } from 'react'

import { useEngineStore } from '@hedron-gl/ui-core'

import type { TimelineNode, TimelineTrack } from '@/types'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'

export const useTimelineData = () => {
  const timelineNode = useEngineStore((state) => state.nodes[TIMELINE_NODE_ID]) as
    | TimelineNode
    | undefined
  const nodes = useEngineStore((state) => state.nodes)

  return useMemo(() => {
    if (!timelineNode) {
      return { durationMs: 60000, tracks: [] }
    }

    const trackIds = timelineNode.childGroups.trackIds ?? []
    const tracks: TimelineTrack[] = trackIds
      .map((id) => {
        const inputNode = nodes[id]
        if (!inputNode) return null
        return {
          id,
          label: inputNode.title,
          keyframes: [],
        }
      })
      .filter((t): t is TimelineTrack => t !== null)

    return {
      durationMs: timelineNode.customData.durationMs,
      tracks,
    }
  }, [timelineNode, nodes])
}
