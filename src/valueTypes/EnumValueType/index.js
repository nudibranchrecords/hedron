import { BaseValueType } from '../BaseValueType'
import midiValueProcess from './midiValueProcess'
import NodeSelect from './container'
import { get } from 'lodash'

const parseOptions = options => options.map(opt => {
  if (!opt.label) opt.label = opt.value
  return opt
})

export class EnumValueType extends BaseValueType {
  Component = NodeSelect

  compatibleInputs = {
    midi: {
      valueProcess: midiValueProcess,
    },
  }

  defaultValue = customConfig => get(customConfig, 'options[0].value')

  parseCustomConfig = ({
    options = [],
  }) => ({
    options: parseOptions(options),
  })
}
