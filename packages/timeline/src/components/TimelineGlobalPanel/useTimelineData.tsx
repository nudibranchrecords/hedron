import { useMemo } from 'react'

import { useEngineStore, useEngineStoreShallow } from '@hedron-gl/ui-core'

import type { TimelineNode, TimelineManagerTrack, TimelineTrackInput } from '@/types'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'

export const useTimelineData = () => {
  const timelineNode = useEngineStore((state) => state.nodes[TIMELINE_NODE_ID]) as
    | TimelineNode
    | undefined
  const trackIds = useMemo(() => timelineNode?.childGroups.trackIds ?? [], [timelineNode])

  const trackNodes = useEngineStoreShallow((state) =>
    trackIds.map((inputId) => state.nodes[inputId] as TimelineTrackInput | undefined),
  )

  const targetNodes = useEngineStoreShallow((state) =>
    trackNodes.map((trackNode) => (trackNode ? state.nodes[trackNode.targetNodeId] : undefined)),
  )

  return useMemo(() => {
    if (!timelineNode) {
      return { durationMs: 60000, tracks: [] }
    }

    const tracks: TimelineManagerTrack[] = trackIds
      .map((inputId, index): TimelineManagerTrack | null => {
        const inputNode = trackNodes[index]
        if (!inputNode) return null

        const targetNode = targetNodes[index]

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
  }, [timelineNode, trackIds, trackNodes, targetNodes])
}
