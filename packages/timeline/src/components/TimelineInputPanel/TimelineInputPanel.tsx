import { useEffect, useId, useRef } from 'react'
import { HedronEngine, InputNode } from '@hedron-gl/engine'
import {
  useNodeOptionNodes,
  useParamValue,
  useAppStore,
  useSubscribeToParamValue,
  ControlGrid,
  NodeContainer,
} from '@hedron-gl/ui-core'
import { useTimelineData } from '@/components/TimelineGlobalPanel/useTimelineData'
import { useTimelineHandlers } from '@/components/TimelineGlobalPanel/useTimelineHandlers'
import { useTimelineManager } from '@/components/TimelineGlobalPanel/useTimelineManager'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline, TimelineHandle } from '@/components/Timeline/Timeline'
import { TimelineOptionNodes } from '@/TimelineInput'
import { findTrackById } from '@/utils/findTrackById'

interface TimelineInputPanelProps {
  input: InputNode
  engine: HedronEngine
}

/**
 * Per-node view for a timeline-track input: the same editor as the global timeline panel
 * (header, playhead, keyframes), scoped down to just this input's own track.
 */
export const TimelineInputPanel = ({ input, engine }: TimelineInputPanelProps) => {
  const timeline = useTimelineData()
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

  const timelineComponentId = useId()

  // Viewing this input's track makes it the selected one
  useEffect(() => {
    setSelectedTrackId(input.id)
    setActiveTimelineComponentId(timelineComponentId)
  }, [input.id, setSelectedTrackId, setActiveTimelineComponentId, timelineComponentId])

  const timelineOptionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const trackOptionNodes = useNodeOptionNodes<TimelineOptionNodes>(input.id)
  const playHeadPositionNode = timelineOptionNodes['playheadPositionMs']
  const playheadPositionMs = useParamValue<number>(playHeadPositionNode?.id, 0)

  const track = findTrackById(timeline.tracks, input.id)

  const zoomPxPerSecondNode = trackOptionNodes['zoomPxPerSecond']!

  const timelineRef = useRef<TimelineHandle>(null)

  useSubscribeToParamValue<number>(zoomPxPerSecondNode.id, (value) => {
    timelineRef.current?.setPxPerSecond(value)
  })

  return (
    <>
      <ControlGrid className="mb-xl">
        <NodeContainer nodeId={zoomPxPerSecondNode.id} />
      </ControlGrid>

      <Timeline
        ref={timelineRef}
        timeline={{ durationMs: timeline.durationMs, tracks: track ? [track] : [] }}
        playheadPositionMs={playheadPositionMs}
        activeTimelineComponentId={activeTimelineComponentId}
        setActiveTimelineComponentId={setActiveTimelineComponentId}
        selectedTrackId={selectedTrackId}
        componentId={timelineComponentId}
        setSelectedTrackId={setSelectedTrackId}
        onPlayheadChange={handlePlayheadChange}
        onKeyframeDelete={handleKeyframeDelete}
        onKeyframeInsert={handleKeyframeInsert}
        onKeyframeMove={handleKeyframeMove}
      />
    </>
  )
}
