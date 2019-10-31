import { BaseValueType } from '../BaseValueType'
import midiValueProcess from './midiValueProcess'
import lfoProcess from '../../utils/lfoProcess'

const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1

export class FloatValueType extends BaseValueType {
  defaultValue = 0

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
      valueProcess: ({ node, inpuLink, value, options }) => {
        const seed = options.seed === -1 ? inpuLink.id : options.seed
        return lfoProcess({ node, value, options, seed })
      },
    },
    audio: {
      valueProcess: ({ value, options }) => value[options.audioBand],
    },
    anim: {},
  }
}
