import { useState, useEffect } from 'react'
import c from './VideoControls.module.css'
import { engine } from '@renderer/engine'

// Include the global type definitions
declare global {
  interface Window {
    saveFrame: () => Promise<void>
    renderFrames: (
      frameCount: number,
      name: string,
      video?: boolean,
      width?: number,
      height?: number,
      audioPath?: string,
    ) => Promise<void>
    resetEvery: (seconds: number, offset?: number) => void
    cancelReset: () => void
    resetTimeoutId?: NodeJS.Timeout | null
  }
}

export interface LoopSettings {
  seconds: number
  offset: number | null
}

interface LoopTabProps {
  loopSettings: LoopSettings
  setLoopSettings: React.Dispatch<React.SetStateAction<LoopSettings>>
}

export function LoopTab({ loopSettings, setLoopSettings }: LoopTabProps): JSX.Element {
  const [loopActive, setLoopActive] = useState(false)
  const [currentLoopTime, setCurrentLoopTime] = useState(0)

  // Check if loop is active on component mount
  useEffect(() => {
    if (window.resetTimeoutId) {
      setLoopActive(true)
    }
  }, [])

  // Update the current loop time at regular intervals
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (loopActive) {
      interval = setInterval(() => {
        setCurrentLoopTime(engine.totalTime)
      }, 30)

      // Clear the interval on component unmount or when loopActive changes
      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [loopActive, loopSettings.seconds])

  // Function to toggle loop
  const toggleLoop = () => {
    if (loopActive) {
      window.cancelReset()
      setLoopActive(false)
    } else {
      window.resetEvery(
        loopSettings.seconds,
        loopSettings.offset !== null ? loopSettings.offset : undefined,
      )
      setLoopActive(true)
    }
  }
  // Handle input changes for loop settings
  const handleLoopSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === '' ? null : Number(value)
    setLoopSettings((prev) => ({ ...prev, [name]: numValue }))
  }

  return (
    <div className={c.form}>
      <p>
        Test animation loops by resetting the time at regular intervals. Useful for previewing
        seamless loops before rendering.
      </p>

      <div className={c.formGroup}>
        <label className={c.label} htmlFor="seconds">
          Loop Duration (seconds)
        </label>
        <input
          className={c.input}
          type="number"
          id="seconds"
          name="seconds"
          value={loopSettings.seconds}
          onChange={handleLoopSettingChange}
          min="0.1"
          step="0.1"
          disabled={loopActive}
        />
      </div>

      <div className={c.formGroup}>
        <label className={c.label} htmlFor="offset">
          Start Offset (optional)
        </label>
        <input
          className={c.input}
          type="number"
          id="offset"
          name="offset"
          value={loopSettings.offset === null ? '' : loopSettings.offset}
          onChange={handleLoopSettingChange}
          min="0"
          step="0.1"
          placeholder="0"
          disabled={loopActive}
        />
        <small>
          Offset lets you test specific parts of your loop. For example, with a 10s loop and 9s
          offset, you&apos;ll see the transition from the end back to the beginning.
        </small>
      </div>

      {loopActive && (
        <div className={c.timelineContainer}>
          <div className={c.timelinePreview}>
            <div
              className={c.timelineMarker}
              style={{
                left: `${((currentLoopTime % loopSettings.seconds) / loopSettings.seconds) * 100}%`,
              }}
            >
              <div className={c.timelineTooltip}>
                {(currentLoopTime % loopSettings.seconds).toFixed(1)}s
              </div>
            </div>

            {loopSettings.offset !== null && (
              <div>
                <div
                  className={c.loopPoint}
                  style={{
                    left: `${(loopSettings.offset / loopSettings.seconds) * 100}%`,
                  }}
                />
                <div
                  className={c.loopPoint}
                  style={{
                    right: `${(loopSettings.offset / loopSettings.seconds) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
          <div className={c.timelineLabels}>
            <span>0s</span>
            <span>{(loopSettings.seconds / 2).toFixed(1)}s</span>
            <span>{loopSettings.seconds.toFixed(1)}s</span>
          </div>
        </div>
      )}

      <div className={c.buttonRow}>
        <button
          className={`${c.actionButton} ${loopActive ? '' : c.primaryButton}`}
          onClick={toggleLoop}
        >
          {loopActive ? 'Stop Loop Test' : 'Start Loop Test'}
        </button>
      </div>
    </div>
  )
}
