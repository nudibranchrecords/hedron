import { BaseValueType } from '../BaseValueType'
import midiValueProcess from '../../utils/midiValueProcess'
import lfoProcess from '../../utils/lfoProcess'
import ParamBar from '../../containers/ParamBar'

const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1

export class FloatValueType extends BaseValueType {
  defaultValue = 0
  Component = ParamBar

  doesValueMatch (value) {
    return typeof value === 'number'
  }

  getTransformedValue (param) {
    if (typeof param.min === 'number' && typeof param.max === 'number') {
      return lerp(param.min, param.max, param.value)
    } else {
      return param.value
    }
  }

  macroInterpolate = lerp

  compatibleInputs = {
    midi: {
      valueProcess: midiValueProcess,
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
}
