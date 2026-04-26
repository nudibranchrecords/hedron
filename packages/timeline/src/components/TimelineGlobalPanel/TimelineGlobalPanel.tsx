import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { Panel, PanelHeader, PanelBody, NodeContainer, useEngineStore } from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { useTimelineHandlers } from './useTimelineHandlers'
import { useTimelineManager } from './useTimelineManager'
import { Timeline } from '@/components/Timeline/Timeline'

const TIMELINE_NODE_ID = 'timeline-input-default-timeline'
const IS_PLAYING_NODE_ID = `${TIMELINE_NODE_ID}-option-isPlaying`
const PLAYHEAD_POSITION_NODE_ID = `${TIMELINE_NODE_ID}-option-playheadPosition`

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = ({ engine }) => {
  const timeline = useTimelineData()
  const manager = useTimelineManager(timeline)
  const playheadPosition = useEngineStore(
    (state) => state.nodeValues[PLAYHEAD_POSITION_NODE_ID] as number | undefined,
  )
  const { handlePlayheadChange, handleKeyframeDelete, handleKeyframeInsert } = useTimelineHandlers({
    engine,
    manager,
    timeline,
  })

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <NodeContainer nodeId={IS_PLAYING_NODE_ID} />
        <Timeline
          timeline={timeline}
          playheadPosition={playheadPosition}
          onPlayheadChange={handlePlayheadChange}
          onKeyframeDelete={handleKeyframeDelete}
          onKeyframeInsert={handleKeyframeInsert}
        />
      </PanelBody>
    </Panel>
  )
}
