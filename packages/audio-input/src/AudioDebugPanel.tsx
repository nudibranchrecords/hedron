import React, { useCallback, useState } from 'react'
import { Button, Collapsible } from '@hedron-gl/ui-core'
import { getAudioDiagnostics, testAudioInputCapture } from './AudioTestUtils'
import { AudioInput } from './AudioInput'
import styles from './AudioGlobalPanel.module.css'

interface AudioDebugPanelProps {
  audioPlugin: AudioInput | undefined
}

/**
 * Debug panel component with tools to test and diagnose audio system issues
 */
export const AudioDebugPanel = ({ audioPlugin }: AudioDebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [testResults, setTestResults] = useState<React.ReactElement | null>(null)

  // Run diagnostics
  const runDiagnostics = useCallback(async () => {
    setIsRunningTest(true)
    setTestResults(<i>Running diagnostics...</i>)

    try {
      const result = await getAudioDiagnostics()
      setTestResults(result)
    } catch (error) {
      setTestResults(
        <div className={styles.errorText}>Error running diagnostics: {String(error)}</div>,
      )
    } finally {
      setIsRunningTest(false)
    }
  }, [])

  // Run audio input test
  const runInputTest = useCallback(async () => {
    setIsRunningTest(true)
    setTestResults(<i>Testing audio input...</i>)

    try {
      const result = await testAudioInputCapture()
      setTestResults(result)
    } catch (error) {
      setTestResults(
        <div className={styles.errorText}>Error testing audio input: {String(error)}</div>,
      )
    } finally {
      setIsRunningTest(false)
    }
  }, [])

  // Log audio plugin state
  const logAudioState = useCallback(() => {
    if (!audioPlugin) {
      console.log('[AudioDebugPanel] Audio plugin not available')
      setTestResults(<div className={styles.errorText}>Audio plugin not available</div>)
      return
    }

    const pluginState = {
      levelsData: [...audioPlugin.analyzer.levelsData],
      bands: audioPlugin.analyzer.bands.map((band) => ({
        centerFreq: band.centerFreq,
        q: band.q,
        color: band.color,
      })),
    }

    console.log('[AudioDebugPanel] Audio Plugin State:', pluginState)

    let freqSample: number[] = []
    if (audioPlugin.audioData) {
      freqSample = Array.from(audioPlugin.audioData.freqs.slice(0, 10))
      console.log('[AudioDebugPanel] Frequency data sample (first 10 bins):', freqSample)
    }

    // Create a formatted display of the audio state
    const stateLines = [
      '=== AUDIO PLUGIN STATE ===',
      '',
      `📊 Analyzer Bands: ${pluginState.bands.length}`,
      ...pluginState.bands.map(
        (band, i) => `  Band ${i + 1}: ${band.centerFreq.toFixed(1)}Hz (Q: ${band.q.toFixed(2)})`,
      ),
      '',
      `📈 Levels Data: [${pluginState.levelsData
        .slice(0, 8)
        .map((v) => v.toFixed(3))
        .join(', ')}${pluginState.levelsData.length > 8 ? '...' : ''}]`,
      '',
      audioPlugin.audioData
        ? `🎵 Frequency Sample: [${freqSample.map((v) => v.toFixed(1)).join(', ')}...]`
        : '🎵 No frequency data available',
      '',
      '✅ Audio state logged to console',
    ]

    setTestResults(<div className={styles.testResultsMonospace}>{stateLines.join('\n')}</div>)
  }, [audioPlugin])

  return (
    <Collapsible
      title={`${isOpen ? 'Hide' : 'Show'} Audio Debug Tools`}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={runDiagnostics} disabled={isRunningTest}>
          Run Audio Diagnostics
        </Button>

        <Button type="secondary" onClick={runInputTest} disabled={isRunningTest}>
          Test Audio Input
        </Button>

        <Button type="neutral" onClick={logAudioState}>
          Log Audio State
        </Button>
      </div>

      {/* Results Display */}
      {testResults && <div className={styles.testResultsArea}>{testResults}</div>}

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#888' }}>
        Use these tools to diagnose audio input issues. Results will be displayed here and in the
        console.
      </div>
    </Collapsible>
  )
}
