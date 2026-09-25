import { useEffect, useId, useMemo, useState } from 'react'
import { HedronEngine, InputNode } from '@hedron-gl/engine'
import { ControlGrid, NodeContainer } from '@hedron-gl/ui-core'
import { useTimelineTracks } from '@/components/hooks/useTimelineTracks'
import { useTimelineHandlers } from '@/components/hooks/useTimelineHandlers'
import { useTimelineManager } from '@/components/hooks/useTimelineManager'
import { useTimelineState } from '@/components/hooks/useTimelineState'
import { useTimelineHandle } from '@/components/hooks/useTimelineHandle'
import { useTimelineOptionNodes } from '@/components/hooks/useTimelineOptionNodes'
import { useAlignedKeyframeValueSync } from '@/components/hooks/useAlignedKeyframeValueSync'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline } from '@/components/Timeline/Timeline'
import { findTrackById } from '@/utils/findTrackById'
import { AlignedKeyframe } from '@/types'

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

  const { playheadPositionMs, durationS, isPlaying } = useTimelineOptionNodes()
  const { zoomPxPerSecondNode } = useTimelineOptionNodes(input.id)
  const [alignedKeyframes, setAlignedKeyframes] = useState<AlignedKeyframe[]>([])
  const isAlignmentEnabled = !isPlaying

  const singleTrackInArray = useMemo(() => {
    const track = findTrackById(tracks, input.id)
    return track ? [track] : []
  }, [tracks, input.id])

  const timelineRef = useTimelineHandle(zoomPxPerSecondNode.id)
  useAlignedKeyframeValueSync({
    engine,
    manager,
    alignedKeyframes,
    isEnabled: isAlignmentEnabled,
  })

  return (
    <>
      <ControlGrid className="mb-xl">
        <NodeContainer nodeId={zoomPxPerSecondNode.id} />
      </ControlGrid>

      <Timeline
        ref={timelineRef}
        durationMs={durationS * 1000}
        tracks={singleTrackInArray}
        playheadPositionMs={playheadPositionMs}
        activeTimelineComponentId={activeTimelineComponentId}
        setActiveTimelineComponentId={setActiveTimelineComponentId}
        selectedTrackId={selectedTrackId}
        componentId={timelineComponentId}
        setSelectedTrackId={setSelectedTrackId}
        isAlignmentEnabled={isAlignmentEnabled}
        onAlignedKeyframesChange={setAlignedKeyframes}
        onPlayheadChange={handlePlayheadChange}
        onKeyframeDelete={handleKeyframeDelete}
        onKeyframeInsert={handleKeyframeInsert}
        onKeyframeMove={handleKeyframeMove}
        onPlayPauseToggle={handlePlayPauseToggle}
      />
    </>
  )
}
