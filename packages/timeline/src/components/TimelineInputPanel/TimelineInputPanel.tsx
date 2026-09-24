import { useEffect, useId } from 'react'
import { HedronEngine, InputNode } from '@hedron-gl/engine'
import { ControlGrid, NodeContainer } from '@hedron-gl/ui-core'
import { useTimelineTracks } from '@/components/hooks/useTimelineTracks'
import { useTimelineHandlers } from '@/components/hooks/useTimelineHandlers'
import { useTimelineManager } from '@/components/hooks/useTimelineManager'
import { useTimelineState } from '@/components/hooks/useTimelineState'
import { useTimelineHandle } from '@/components/hooks/useTimelineHandle'
import { useTimelineOptionNodes } from '@/components/hooks/useTimelineOptionNodes'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline } from '@/components/Timeline/Timeline'
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
  const tracks = useTimelineTracks()
  const manager = useTimelineManager(DEFAULT_TIMELINE_ID)

  const {
    handlePlayheadChange,
    handleKeyframeDelete,
    handleKeyframeInsert,
    handleKeyframeMove,
    handlePlayPauseToggle,
  } = useTimelineHandlers({
    engine,
    manager,
  })

  const {
    activeTimelineComponentId,
    setActiveTimelineComponentId,
    selectedTrackId,
    setSelectedTrackId,
  } = useTimelineState()

  const timelineComponentId = useId()

  // Viewing this input's track makes it the selected one
  useEffect(() => {
    setSelectedTrackId(input.id)
    setActiveTimelineComponentId(timelineComponentId)
  }, [input.id, setSelectedTrackId, setActiveTimelineComponentId, timelineComponentId])

  const { playheadPositionMs, durationS } = useTimelineOptionNodes()
  const { zoomPxPerSecondNode } = useTimelineOptionNodes(input.id)

  const track = findTrackById(tracks, input.id)

  const timelineRef = useTimelineHandle(zoomPxPerSecondNode.id)

  return (
    <>
      <ControlGrid className="mb-xl">
        <NodeContainer nodeId={zoomPxPerSecondNode.id} />
      </ControlGrid>

      <Timeline
        ref={timelineRef}
        durationMs={durationS * 1000}
        tracks={track ? [track] : []}
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
        onPlayPauseToggle={handlePlayPauseToggle}
      />
    </>
  )
}
