import { BaseValueType } from '../BaseValueType'
import { getMidiValue } from '../../utils/getMidiValue'
import lfoProcess from '../../utils/lfoProcess'
import ParamBar from './container'
import ParamRange from './ParamRange'

const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1

export class FloatValueType extends BaseValueType {
  // The default value for any param of this type, if not set by the user in the config.js
  // This can also be a function, with takes an options and returns the value
  defaultValue = 0

  // The component to render, which will be given a prop of the node Id for the component
  Component = ParamBar

  // The component to render for advanced control (if any)
  AdvancedControlComponent = ParamRange

  // Function to check if the value of the node matches the type
  doesValueMatch (value) {
    return typeof value === 'number'
  }

  // Do any special final processing on the value here
  getTransformedValue (param) {
    if (typeof param.min === 'number' && typeof param.max === 'number') {
      return lerp(param.min, param.max, param.value)
    } else {
      return param.value
    }
  }

  // Macro interpolation
  macroInterpolate = lerp

  // All compatible inputs are defined in an object
  // Each item can have a valueProcess and a generateExtraOptions property
  compatibleInputs = {
    midi: {
      valueProcess: ({ node, value: midiValue, options: midiOptions, messageCount }) =>
        getMidiValue(node.value, midiValue, midiOptions, messageCount),
    },
    lfo: {
      valueProcess: ({ inputLink, value, options: { shape, rate, phase, seed } }) => {
        seed === -1 ? inputLink.id : seed
        return lfoProcess(value, shape, rate, phase, seed)
      },
    },
    audio: {
      valueProcess: ({ value, options }) => value[options.audioBand],
    },
    // TODO: anim should probably be handled here instead of core
    // For now, this empty object is enough for the option to show
    anim: {},
  }

  // How to deal with custom config options, takes in custom config options, returns an object that will be
  // merged into the node's properties
  parseCustomConfig = ({
    defaultMin = 0,
    defaultMax = 1,
    min = defaultMin,
    max = defaultMax,
  }) => ({
    min,
    max,
    defaultMin,
    defaultMax,
  })
}
