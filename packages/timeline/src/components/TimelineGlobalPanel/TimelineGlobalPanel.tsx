import React from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import {
  Panel,
  PanelHeader,
  PanelBody,
  NodeContainer,
  useNodeOptionNodes,
  useResource,
  useParamValue,
} from '@hedron-gl/ui-core'
import { useTimelineData } from './useTimelineData'
import { useTimelineHandlers } from './useTimelineHandlers'
import { useTimelineManager } from './useTimelineManager'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline } from '@/components/Timeline/Timeline'
import { TimelineOptionNodes } from '@/TimelineInput'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel: React.FC<TimelineGlobalPanelProps> = ({ engine }) => {
  const timeline = useTimelineData()
  const manager = useTimelineManager(timeline)

  const { handlePlayheadChange, handleKeyframeDelete, handleKeyframeInsert } = useTimelineHandlers({
    engine,
    manager,
    timeline,
  })

  const optionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const isPlayingNode = optionNodes['isPlaying']!
  const playHeadPositionNode = optionNodes['playheadPositionMs']!
  const audioFilename = useParamValue<string>(optionNodes['audioUrl']!.id)

  const audioUrl = useResource(audioFilename)

  // Not very performant to be updating state on every frame, later we'll want to do this imperatively using useSubscribeToParamValue
  const playheadPositionMs = useParamValue<number>(playHeadPositionNode.id)

  return (
    <Panel>
      <PanelHeader>Timeline</PanelHeader>
      <PanelBody>
        <NodeContainer nodeId={isPlayingNode.id} />
        <audio src={audioUrl} controls style={{ width: '100%' }} />
        <div className="mb-xl">
          <Timeline
            timeline={timeline}
            playheadPositionMs={playheadPositionMs}
            onPlayheadChange={handlePlayheadChange}
            onKeyframeDelete={handleKeyframeDelete}
            onKeyframeInsert={handleKeyframeInsert}
          />
        </div>
        Click track name to select track. Insert keyframe: [i]. Delete keyframe: [x].
      </PanelBody>
    </Panel>
  )
}
