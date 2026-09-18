import { useRef } from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import {
  NodeContainer,
  useNodeOptionNodes,
  useParamValue,
  useAppStore,
  ControlGrid,
  useSubscribeToParamValue,
} from '@hedron-gl/ui-core'
import { useTimelineTracks } from './useTimelineTracks'
import { useTimelineHandlers } from './useTimelineHandlers'
import { useTimelineManager } from './useTimelineManager'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline, TimelineHandle } from '@/components/Timeline/Timeline'
import { TimelineOptionNodes } from '@/TimelineInput'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel = ({ engine }: TimelineGlobalPanelProps) => {
  const tracks = useTimelineTracks()
  const manager = useTimelineManager(DEFAULT_TIMELINE_ID)

  const { handlePlayheadChange, handleKeyframeDelete, handleKeyframeInsert, handleKeyframeMove } =
    useTimelineHandlers({
      engine,
      manager,
    })

  const activeTimelineComponentId = useAppStore((state) => state.activeTimelineComponentId)
  const setActiveTimelineComponentId = useAppStore((state) => state.setActiveTimelineComponentId)
  const selectedTrackId = useAppStore((state) => state.selectedTimelineTrackId)
  const setSelectedTrackId = useAppStore((state) => state.setSelectedTimelineTrackId)

  const optionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const isPlayingNode = optionNodes['isPlaying']!
  const playHeadPositionNode = optionNodes['playheadPositionMs']

  const audioUrlNode = optionNodes['audioUrl']!
  const zoomPxPerSecondNode = optionNodes['zoomPxPerSecond']!
  const durationNode = optionNodes['timelineDurationS']!

  // Not very performant to be updating state on every frame, later we'll want to do this imperatively using useSubscribeToParamValue
  const playheadPositionMs = useParamValue<number>(playHeadPositionNode?.id, 0)
  const initialZoomPxPerSecond = useParamValue<number>(zoomPxPerSecondNode.id, 80)
  const durationS = useParamValue<number>(durationNode.id, 0)

  const timelineRef = useRef<TimelineHandle>(null)

  useSubscribeToParamValue<number>(zoomPxPerSecondNode.id, (value) => {
    timelineRef.current?.setPxPerSecond(value)
  })

  return (
    <div>
      <ControlGrid className="mb-xl">
        <NodeContainer nodeId={zoomPxPerSecondNode.id} />
        <NodeContainer nodeId={isPlayingNode.id} />
        <NodeContainer nodeId={audioUrlNode.id} />
        <NodeContainer nodeId={durationNode.id} />
      </ControlGrid>
      <div className="mb-xl">
        <Timeline
          ref={timelineRef}
          durationMs={durationS * 1000}
          tracks={tracks}
          playheadPositionMs={playheadPositionMs}
          activeTimelineComponentId={activeTimelineComponentId}
          setActiveTimelineComponentId={setActiveTimelineComponentId}
          selectedTrackId={selectedTrackId}
          setSelectedTrackId={setSelectedTrackId}
          initialPxPerSecond={initialZoomPxPerSecond}
          onPlayheadChange={handlePlayheadChange}
          onKeyframeDelete={handleKeyframeDelete}
          onKeyframeInsert={handleKeyframeInsert}
          onKeyframeMove={handleKeyframeMove}
        />
      </div>
      Click track name to select track. Insert keyframe: [i]. Delete keyframe: [x].
    </div>
  )
}
