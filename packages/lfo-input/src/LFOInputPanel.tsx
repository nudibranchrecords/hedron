import { HedronEngine, Input } from '@hedron/engine'
import { ControlGrid } from '@hedron/ui-core'
import { LFOOptionControl } from './LFOOptionControl'
import { LFOInputOptions } from './LFOInput'

interface IProps {
  input: Input<LFOInputOptions>
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

const enumOptions = {
  waveType: ['sine', 'square', 'sawtooth', 'triangle'].map((waveType) => ({
    label: waveType,
    value: waveType,
  })),
} as const

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ input, engine }: IProps) => {
  const inputOptions = [
    ['waveType', 'dropdown', input.options.waveType],
    ['frequency', 'slider', input.options.frequency],
    ['amplitude', 'slider', input.options.amplitude],
    ['phase', 'slider', input.options.phase],
    ['min', 'slider', input.options.min],
    ['max', 'slider', input.options.max],
    ['isEnabled', 'boolean', input.options.isEnabled ?? false],
  ] as const

  return (
    <div>
      LFO!!
      <ControlGrid className="mb-xl">
        {inputOptions.map(([key, type, value]) => (
          <LFOOptionControl
            key={key}
            label={key}
            value={value}
            controlOption={{ type, values: enumOptions[key] }}
            onChange={(newVal) => {
              engine
                .getStore()
                .getState()
                .updateInputOptions(input.id, {
                  [key]: newVal,
                })
            }}
          />
        ))}
      </ControlGrid>
    </div>
  )
}
