import { BaseValueType } from '../BaseValueType'
import midiValueProcess from './midiValueProcess'
import NodeSelect from '../../containers/NodeSelect'

export class EnumValueType extends BaseValueType {
  defaultValue = ''
  Component = NodeSelect

  compatibleInputs = {
    midi: {
      valueProcess: midiValueProcess,
    },
  }
}
