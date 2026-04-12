import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { Panel, PanelHeader, PanelBody, useEngineStore } from '@hedron-gl/ui-core'
import { Timeline } from '@/components/Timeline/Timeline'
import type { Timeline as TimelineData } from '@/types'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

const TIMELINE_NODE_ID = 'timeline-input-global-default-timeline'

const emptyTimeline: TimelineData = {
  durationMs: 10000,
  tracks: [],
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = ({ engine: _engine }) => {
  const timelineNode = useEngineStore((state) => state.nodes[TIMELINE_NODE_ID]) as
    | (Record<string, unknown> & { tracks?: TimelineData['tracks']; durationMs?: number })
    | undefined

  const timeline: TimelineData = {
    durationMs: timelineNode?.durationMs ?? emptyTimeline.durationMs,
    tracks: timelineNode?.tracks ?? emptyTimeline.tracks,
  }

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <Timeline timeline={timeline} />
      </PanelBody>
    </Panel>
  )
}
