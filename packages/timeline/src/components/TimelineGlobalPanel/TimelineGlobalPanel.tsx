import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { Panel, PanelHeader, PanelBody } from '@hedron-gl/ui-core'
import { Timeline } from '@/components/Timeline/Timeline'
import type { Timeline as TimelineData } from '@/types'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

const emptyTimeline: TimelineData = {
  durationMs: 10000,
  tracks: [],
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = ({ engine: _engine }) => {
  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <Timeline timeline={emptyTimeline} />
      </PanelBody>
    </Panel>
  )
}
