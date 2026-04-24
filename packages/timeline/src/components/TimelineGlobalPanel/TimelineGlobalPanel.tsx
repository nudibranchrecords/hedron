import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { Panel, PanelHeader, PanelBody, NodeContainer } from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { useTimelineManager } from './useTimelineManager'
import { Timeline } from '@/components/Timeline/Timeline'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const IS_PLAYING_NODE_ID = `${TIMELINE_NODE_ID}-option-isPlaying`

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = () => {
  const timeline = useTimelineData()
  useTimelineManager(timeline)

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <NodeContainer nodeId={IS_PLAYING_NODE_ID} />
        <Timeline timeline={timeline} />
      </PanelBody>
    </Panel>
  )
}
