import { HedronEngine, Input } from '@hedron/engine'
import { ControlGrid } from '@hedron/ui-core'
import { LFOInput, LFOInputOptions } from './LFOInput'

interface IProps {
  input: Input<LFOInputOptions>
  // TODO: This can be typed as something like HedronEngineWithPlugin<MidiInput>
  engine: HedronEngine
}

/**
 * A react component that displays the lfo settings for a parameter
 */
export const LFOInputPanel = ({ input, engine }: IProps) => {
  // TODO: May not need this "as" if we have HedronEngineWithPlugin<LFOInput>
  const plugin = engine.plugins['lfo-input'] as LFOInput

  return (
    <div>
      LFO!
      <ControlGrid className="mb-xl"></ControlGrid>
    </div>
  )
}
