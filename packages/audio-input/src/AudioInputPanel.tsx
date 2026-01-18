import { HedronEngine, Input } from '@hedron/engine'
import { ControlGrid, NodeContainer } from '@hedron/ui-core'
import { useEffect, useState } from 'react'
import { AudioInput } from './AudioInput'
import { calculateAverageLevel, getLevelColor } from './AudioUtils'
import styles from './AudioInputPanel.module.css'

interface IProps {
  input: Input
  // TODO: This can be typed as something like HedronEngineWithPlugin<AudioInput>
  engine: HedronEngine
}

/**
 * A react component that displays the audio settings for a parameter
 * Includes a visualization of the audio frequency data
 */
export const AudioInputPanel = ({ input, engine }: IProps) => {
  // Get the AudioInput plugin instance from the engine
  const audioPlugin = engine.plugins[AudioInput.ID] as AudioInput | undefined

  // Log selected frequency band from input options
  const frequencyOption = input.optionNodeIds.find((id: string) => id.includes('frequency'))
  if (frequencyOption) {
    console.log('[AudioInputPanel] Selected frequency band option:', frequencyOption)
  }

  // Add state
  const [audioLevel, setAudioLevel] = useState(0)

  // Monitor audio level using shared utility
  useEffect(() => {
    if (!audioPlugin) return

    const interval = setInterval(() => {
      if (audioPlugin.analyzer.levelsData && audioPlugin.analyzer.levelsData.length > 0) {
        // Calculate average level across all bands using shared utility
        const avgLevel = calculateAverageLevel(audioPlugin.analyzer.levelsData)
        setAudioLevel(avgLevel)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [audioPlugin])

  return (
    <div>
      {audioPlugin?.audioData ? (
        <>
          {/* Audio Status & Controls */}
          <div className={styles.audioStatusContainer}>
            <div>
              {/* Audio Level Meter */}
              <div className={styles.audioLevelContainer}>
                <span className={styles.audioLevelLabel}>Level:</span>
                <div className={styles.audioLevelMeter}>
                  <div
                    className={styles.audioLevelValue}
                    style={{
                      width: `${audioLevel * 100}%`,
                      backgroundColor: getLevelColor(audioLevel),
                    }}
                  />
                </div>
                <span className={styles.audioLevelText}>{(audioLevel * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.audioErrorMessage}>
          Audio input not available. Check console for details.
        </div>
      )}

      <ControlGrid className="mb-xl">
        {input.optionNodeIds.map((id: string) => (
          <NodeContainer key={id} nodeId={id} />
        ))}
      </ControlGrid>
    </div>
  )
}
