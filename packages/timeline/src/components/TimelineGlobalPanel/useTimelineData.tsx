import { useMemo } from 'react'

import { useEngineStore } from '@hedron-gl/ui-core'

import type { TimelineNode, TimelineManagerTrack, TimelineTrackInput } from '@/types'

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
    const tracks: TimelineManagerTrack[] = trackIds
      .map((inputId): TimelineManagerTrack | null => {
        const inputNode = nodes[inputId] as TimelineTrackInput | undefined
        if (!inputNode) return null

        const targetNode = nodes[inputNode.targetNodeId]

        if (!targetNode) return null

        return {
          id: inputId,
          label: targetNode.title,
          keyframes: inputNode.customData?.keyframes ?? [],
          targetNodeId: inputNode.targetNodeId,
        }
      })
      .filter((t): t is TimelineManagerTrack => t !== null)

    return {
      durationMs: timelineNode.customData.durationMs,
      tracks,
    }
  }, [timelineNode, nodes])
}
