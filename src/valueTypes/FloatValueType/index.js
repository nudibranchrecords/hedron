import { BaseValueType } from '../BaseValueType'

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
}
