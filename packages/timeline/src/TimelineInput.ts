import {
  defineOptionNodeConfigs,
  HedronEngine,
  InputNode,
  IPlugin,
  isEqual,
  OptionNodesFromConfigs,
  isParamVector,
  ParamNode,
  ParamValue,
  PluginUpdateArgs,
  ShotNode,
  isParamVectorComponent,
} from '@hedron-gl/engine'
import { DEFAULT_TIMELINE_ID, TIMELINE_DURATION } from './constants'
import { TimelineManager, OnAudioElementChangeCallback } from './TimelineManager'
import { getTimelineTracks } from './selectors/getTimelineTracks'
import { getResourceUrl } from './utils/getResourceUrl'
import { TimelineManagerKeyframeTrack, TimelineManagerTrack } from './types'

// defineOptionNodeConfigs is only needed if we want nice TS node name inference in other parts of the plugin
export const TIMELINE_OPTION_NODE_CONFIGS = defineOptionNodeConfigs([
  {
    nodeType: 'param',
    key: 'playheadPositionMs',
    valueType: 'number',
    defaultValue: 0,
  },
  {
    nodeType: 'param',
    key: 'isPlaying',
    valueType: 'boolean',
    defaultValue: false,
  },
  // This is a cheap hack to get audio working, eventually you'll manually add an audio track
  {
    nodeType: 'param',
    key: 'audioUrl',
    valueType: 'file',
    defaultValue: null,
    accept: ['audio/*'],
  },
  {
    nodeType: 'param',
    key: 'durationSeconds',
    valueType: 'number',
    defaultValue: TIMELINE_DURATION / 1000,
  },
])

// We can use TimelineOptionNodes for strong typing when using useNodeOptionNodes
export type TimelineOptionNodes = OptionNodesFromConfigs<typeof TIMELINE_OPTION_NODE_CONFIGS>

const getKeyframeTracks = (tracks: TimelineManagerTrack[]): TimelineManagerKeyframeTrack[] => {
  const keyframeTracks: TimelineManagerKeyframeTrack[] = []

  for (const track of tracks) {
    if (track.trackType === 'keyframe') {
      keyframeTracks.push(track)
      continue
    }

    if (track.trackType === 'vector') {
      keyframeTracks.push(...getKeyframeTracks(track.childTracks))
    }
  }

  return keyframeTracks
}

export class TimelineInput implements IPlugin {
  public readonly id = 'timeline-input'
  public readonly name = 'Timeline Input'
  public readonly iconName = 'timeline'
  public readonly inputType = 'timeline-track'
  public readonly description = 'Timeline-based input for automating parameters over time.'
  public timelineManagers: Map<string, TimelineManager> = new Map()

  // Set by the app composition root (see onAudioElementChange), re-wired to each manager's hook.
  private audioElementChangeCallback: OnAudioElementChangeCallback | null = null

  onEngineInitialize(engine: HedronEngine) {
    engine.addNodeOnce(DEFAULT_TIMELINE_ID, null, {
      title: 'Default Timeline',
      key: 'default-timeline',
      nodeType: 'custom',
      customNodeType: 'timeline',
    })

    engine.addOptionNodes(DEFAULT_TIMELINE_ID, TIMELINE_OPTION_NODE_CONFIGS)

    const durationNode = engine.getNodeOptionNode(DEFAULT_TIMELINE_ID, 'durationSeconds')
    const initialDurationSeconds =
      (engine.getParamValue(durationNode.id) as number | undefined) ?? TIMELINE_DURATION / 1000

    this.timelineManagers.set(
      DEFAULT_TIMELINE_ID,
      new TimelineManager(
        {
          durationMs: initialDurationSeconds * 1000,
          tracks: [],
        },
        engine.clock,
      ),
    )

    this.timelineManagers.forEach((manager, timelineId) => {
      const isPlaying = engine.getNodeOptionNode(timelineId, 'isPlaying')
      const playHeadPositionNode = engine.getNodeOptionNode(timelineId, 'playheadPositionMs')
      const durationSeconds = engine.getNodeOptionNode(timelineId, 'durationSeconds')

      // Registered before the tracks subscription builds the audio element, so it gets reported.
      manager.onAudioElementChange((element) => {
        this.audioElementChangeCallback?.(element)
      })

      engine.getStore().subscribe(
        (state) => getTimelineTracks(state, timelineId),
        (tracks) => {
          manager.setTracks(tracks)
        },
        {
          equalityFn: isEqual,
          fireImmediately: true,
        },
      )

      engine.subscribeToParamValue(isPlaying.id, (isPlaying) => {
        if (isPlaying) {
          manager.play()
        } else {
          manager.pause()
        }
      })

      engine.subscribeToParamValue(durationSeconds.id, (seconds) => {
        if (typeof seconds === 'number') {
          manager.setDuration(seconds * 1000)
        }
      })

      // Snaps duration to the audio's exact length when a new resource is picked.
      // Not `fireImmediately` - only fires on a later change, not on project load.
      const audioUrl = engine.getNodeOptionNode(timelineId, 'audioUrl')
      engine.subscribeToParamValue(audioUrl.id, (resourceId) => {
        if (typeof resourceId !== 'string' || !resourceId) return

        const url = getResourceUrl(engine.getStoreState(), resourceId)
        if (!url) return

        this.setDurationFromAudioUrl(engine, durationSeconds.id, url)
      })

      manager.onUpdate((changed) => {
        engine.setParamValue(playHeadPositionNode.id, manager.getPosition())

        const changedTrackIds = Object.keys(changed)
        if (changedTrackIds.length > 0) {
          const allTracks = getTimelineTracks(engine.getStoreState(), timelineId)
          const tracks = getKeyframeTracks(allTracks)

          const paramTargetNodeIds: string[] = []
          const paramValues: ParamValue[] = []

          for (const trackId of changedTrackIds) {
            const targetNodeId =
              tracks.find((track) => track.id === trackId)?.targetNodeId ?? trackId
            const targetNode = engine.getNode(targetNodeId)
            const value = changed[trackId]

            if (targetNode?.nodeType === 'shot') {
              engine.fireShot(targetNodeId)
              continue
            }

            paramTargetNodeIds.push(targetNodeId)
            paramValues.push(value)
          }

          if (paramTargetNodeIds.length > 0) {
            engine.setMultipleParamValues(paramTargetNodeIds, paramValues)
          }
        }
      })
    })
  }

  /** Fires whenever any timeline's audio-track element is created, replaced, or removed. */
  onAudioElementChange(callback: OnAudioElementChangeCallback) {
    this.audioElementChangeCallback = callback
  }

  /** Decodes the audio at `url` and writes its exact duration (in seconds) to the duration param. */
  private async setDurationFromAudioUrl(engine: HedronEngine, durationNodeId: string, url: string) {
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()

      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      await audioContext.close()

      const exactSeconds = audioBuffer.length / audioBuffer.sampleRate
      engine.setParamValue(durationNodeId, exactSeconds)
    } catch (error) {
      console.error('[TimelineInput] Failed to derive duration from audio resource:', error)
    }
  }

  update(_engine: HedronEngine, { deltaTime }: PluginUpdateArgs) {
    this.timelineManagers.forEach((manager) => {
      if (manager.isPlaying()) {
        manager.step(deltaTime * 1000)
      }
    })
  }

  onNewInput(engine: HedronEngine, newInput: InputNode, targetNode: ParamNode | ShotNode) {
    // Don't do anything if we're dealing with a vector component (e.g. x,y,z)
    if (isParamVectorComponent(targetNode, engine)) {
      return
    }

    // Input ID is only a child of the target node, we also need to make it a child of the timeline node so it shows up in the timeline UI
    engine.addChildToNode(DEFAULT_TIMELINE_ID, 'trackIds', newInput.id)

    if (isParamVector(targetNode)) {
      targetNode.childGroups.vectorComponentIds.forEach((nodeId) => {
        const childInput = engine.addInput(this.inputType, nodeId)!

        // Add vector components as children of parent track
        engine.addChildToNode(newInput.id, 'trackIds', childInput.id)
      })
    }
  }
}
