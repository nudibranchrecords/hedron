import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { Panel, PanelHeader, PanelBody } from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { Timeline } from '@/components/Timeline/Timeline'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = () => {
  const timeline = useTimelineData()

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <Timeline timeline={timeline} />
      </PanelBody>
    </Panel>
  )
}
