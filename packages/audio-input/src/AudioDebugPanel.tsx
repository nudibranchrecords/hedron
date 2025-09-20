import { useCallback, useState, useRef, useEffect } from 'react'
import { getAudioDiagnostics, testAudioInputCapture } from './AudioTestUtils'
import { AudioInput } from './AudioInput'
import { TestToneOptions, playTestTone } from './AudioUtils'

interface AudioDebugPanelProps {
  audioPlugin: AudioInput | undefined
}

/**
 * Debug panel component with tools to test and diagnose audio system issues
 */
export const AudioDebugPanel = ({ audioPlugin }: AudioDebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [diagReport, setDiagReport] = useState<string | null>(null)
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [testToneActive, setTestToneActive] = useState(false)
  const [testFrequency, setTestFrequency] = useState(440)
  const [testResults, setTestResults] = useState<any>(null)

  // Run diagnostics
  const runDiagnostics = useCallback(async () => {
    setIsRunningTest(true)
    setDiagReport('Running diagnostics...')

    try {
      const report = await getAudioDiagnostics()
      setDiagReport(report)
    } catch (error) {
      setDiagReport(`Error running diagnostics: ${error}`)
    } finally {
      setIsRunningTest(false)
    }
  }, [])

  // Run audio input test
  const runInputTest = useCallback(async () => {
    setIsRunningTest(true)
    setTestResults('Testing audio input...')

    try {
      const results = await testAudioInputCapture()
      setTestResults(results)
    } catch (error) {
      setTestResults(`Error testing audio input: ${error}`)
    } finally {
      setIsRunningTest(false)
    }
  }, [])

  // Play test tone using the utility function
  const handleTestTone = useCallback(() => {
    if (testToneActive) return

    setTestToneActive(true)

    // Call with duration to get a Promise
    const result = playTestTone(testFrequency, 2000, 0.3)

    // Since we provided a duration, we know it returns a Promise
    if (result instanceof Promise) {
      result
        .then(() => {
          setTestToneActive(false)
        })
        .catch((error) => {
          console.error('[AudioDebugPanel] Test tone error:', error)
          setTestToneActive(false)
        })
    }
  }, [testFrequency, testToneActive])

  // Log audio plugin state
  const logAudioState = useCallback(() => {
    if (!audioPlugin) {
      console.log('[AudioDebugPanel] Audio plugin not available')
      return
    }

    console.log('[AudioDebugPanel] Audio Plugin State:', {
      levelsData: [...audioPlugin.analyzer.levelsData],
      bands: audioPlugin.analyzer.bands.map((band) => ({
        centerFreq: band.centerFreq,
        q: band.q,
        color: band.color,
      })),
    })

    if (audioPlugin.audioData) {
      console.log(
        '[AudioDebugPanel] Frequency data sample (first 10 bins):',
        Array.from(audioPlugin.audioData.freqs.slice(0, 10)),
      )
    }

    // If in browser, add to console
    alert('Audio state logged to console. Check developer tools.')
  }, [audioPlugin])

  if (!isOpen) {
    return (
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show Audio Debug Tools
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#2a2a2a',
        borderRadius: '4px',
        fontSize: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <h3 style={{ margin: 0, color: '#fff' }}>Audio Debug Tools</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            padding: '2px 6px',
            fontSize: '11px',
            backgroundColor: 'transparent',
            color: '#aaa',
            border: '1px solid #aaa',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Hide
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={runDiagnostics}
          disabled={isRunningTest}
          style={{
            padding: '6px 12px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunningTest ? 'not-allowed' : 'pointer',
            opacity: isRunningTest ? 0.7 : 1,
          }}
        >
          Run Audio Diagnostics
        </button>

        <button
          onClick={runInputTest}
          disabled={isRunningTest}
          style={{
            padding: '6px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunningTest ? 'not-allowed' : 'pointer',
            opacity: isRunningTest ? 0.7 : 1,
          }}
        >
          Test Audio Input
        </button>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="number"
            value={testFrequency}
            onChange={(e) => setTestFrequency(parseInt(e.target.value) || 440)}
            min="20"
            max="20000"
            step="10"
            style={{
              width: '60px',
              marginRight: '4px',
              padding: '4px',
              backgroundColor: '#444',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
            }}
          />
          <span style={{ color: '#aaa', marginRight: '6px' }}>Hz</span>
          <button
            onClick={handleTestTone}
            disabled={testToneActive || isRunningTest}
            style={{
              padding: '6px 12px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: testToneActive || isRunningTest ? 'not-allowed' : 'pointer',
              opacity: testToneActive || isRunningTest ? 0.7 : 1,
            }}
          >
            {testToneActive ? 'Playing...' : 'Play Test Tone'}
          </button>
        </div>

        <button
          onClick={logAudioState}
          style={{
            padding: '6px 12px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Log Audio State
        </button>
      </div>

      {/* Results Display */}
      {diagReport && (
        <div
          style={{
            backgroundColor: '#333',
            padding: '8px',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#eee',
          }}
        >
          {diagReport}
        </div>
      )}

      {testResults && typeof testResults !== 'string' && (
        <div
          style={{
            backgroundColor: '#333',
            padding: '8px',
            borderRadius: '4px',
            marginTop: '12px',
            color: '#eee',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: testResults.success ? '#4CAF50' : '#FF5252' }}>
            Audio Input Test Results
          </h4>
          <div style={{ marginBottom: '6px' }}>{testResults.message}</div>

          {testResults.metrics && (
            <div>
              <div>Devices detected: {testResults.metrics.deviceCount}</div>
              {testResults.metrics.deviceLabel && (
                <div>Active device: {testResults.metrics.deviceLabel}</div>
              )}
              {testResults.metrics.noiseFloor !== undefined && (
                <div>
                  Noise floor: {Math.round(testResults.metrics.noiseFloor * 100)}%
                  {testResults.metrics.noiseFloor > 0.1 && (
                    <span style={{ color: '#FF5252' }}> (High background noise detected)</span>
                  )}
                </div>
              )}
              {testResults.metrics.peakLevel !== undefined && (
                <div>
                  Peak level: {Math.round(testResults.metrics.peakLevel * 100)}%
                  {testResults.metrics.peakLevel < 0.3 && (
                    <span style={{ color: '#FFEB3B' }}> (Low signal level)</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {testResults && typeof testResults === 'string' && (
        <div
          style={{
            backgroundColor: '#333',
            padding: '8px',
            borderRadius: '4px',
            marginTop: '12px',
            color: '#eee',
            fontStyle: 'italic',
          }}
        >
          {testResults}
        </div>
      )}

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#888' }}>
        Use these tools to diagnose audio input issues. Results will be displayed here and in the
        console.
      </div>
    </div>
  )
}
