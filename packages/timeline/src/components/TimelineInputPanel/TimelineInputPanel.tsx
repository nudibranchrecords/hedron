import { useEffect, useId } from 'react'
import { HedronEngine, InputNode } from '@hedron-gl/engine'
import { useNodeOptionNodes, useParamValue, useAppStore } from '@hedron-gl/ui-core'
import { useTimelineData } from '@/components/TimelineGlobalPanel/useTimelineData'
import { useTimelineHandlers } from '@/components/TimelineGlobalPanel/useTimelineHandlers'
import { useTimelineManager } from '@/components/TimelineGlobalPanel/useTimelineManager'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline } from '@/components/Timeline/Timeline'
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

  const { handlePlayheadChange, handleKeyframeDelete, handleKeyframeInsert } = useTimelineHandlers({
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

  const optionNodes = useNodeOptionNodes<TimelineOptionNodes>(DEFAULT_TIMELINE_ID)
  const playHeadPositionNode = optionNodes['playheadPositionMs']!
  const playheadPositionMs = useParamValue<number>(playHeadPositionNode.id)

  const track = findTrackById(timeline.tracks, input.id)

  return (
    <Timeline
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
    />
  )
}
