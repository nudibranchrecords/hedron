import { HedronEngine, ParamWithInfo, UseEngineStore } from '@hedron/engine'
import { MidiSetting } from './MidiSetting'
import { Midi } from '.'

/**
 * Get the MIDI setting jsx element
 * @param param The parameter to display the midi setting for
 * @param engine hedron engine
 * @param useEngineStore useEngineStore hook
 * @param midi midi plugin
 * @returns A JSX Elelemnt that displays connected midi inputs, and allows for midi learning
 */
export function getMidiSetting(
  param: ParamWithInfo,
  engine: HedronEngine,
  useEngineStore: UseEngineStore,
  midi: Midi,
): JSX.Element {
  return <MidiSetting param={param} engine={engine} useEngineStore={useEngineStore} midi={midi} />
}
