import { useState } from 'react'
import { HedronEngine } from '@hedron-gl/engine'
import { NodeContainer, ControlGrid } from '@hedron-gl/ui-core'
import { useTimelineTracks } from '@/components/hooks/useTimelineTracks'
import { useTimelineHandlers } from '@/components/hooks/useTimelineHandlers'
import { useTimelineManager } from '@/components/hooks/useTimelineManager'
import { useTimelineState } from '@/components/hooks/useTimelineState'
import { useTimelineOptionNodes } from '@/components/hooks/useTimelineOptionNodes'
import { useTimelineHandle } from '@/components/hooks/useTimelineHandle'
import { useAlignedKeyframeValueSync } from '@/components/hooks/useAlignedKeyframeValueSync'
import { DEFAULT_TIMELINE_ID } from '@/constants'
import { Timeline } from '@/components/Timeline/Timeline'
import { AlignedKeyframe } from '@/types'

interface TimelineGlobalPanelProps {
  engine: HedronEngine
}

export const TimelineGlobalPanel = ({ engine }: TimelineGlobalPanelProps) => {
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

  const {
    isPlayingNode,
    audioUrlNode,
    zoomPxPerSecondNode,
    zoomPxPerSecond,
    durationNode,
    durationS,
    playheadPositionMs,
    isPlaying,
  } = useTimelineOptionNodes()
  const [alignedKeyframes, setAlignedKeyframes] = useState<AlignedKeyframe[]>([])
  const isAlignmentEnabled = !isPlaying

  const timelineRef = useTimelineHandle(zoomPxPerSecondNode.id)
  useAlignedKeyframeValueSync({
    engine,
    manager,
    alignedKeyframes,
    isEnabled: isAlignmentEnabled,
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
          initialPxPerSecond={zoomPxPerSecond}
          isAlignmentEnabled={isAlignmentEnabled}
          onAlignedKeyframesChange={setAlignedKeyframes}
          onPlayheadChange={handlePlayheadChange}
          onKeyframeDelete={handleKeyframeDelete}
          onKeyframeInsert={handleKeyframeInsert}
          onKeyframeMove={handleKeyframeMove}
          onPlayPauseToggle={handlePlayPauseToggle}
        />
      </div>
      Click track name to select track. Insert keyframe: [i]. Delete keyframe: [x].
    </div>
  )
}
