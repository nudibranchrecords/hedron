import { FloatValueType } from './FloatValueType'
import { BooleanValueType } from './BooleanValueType'
import { ShotFloatValueType } from './ShotFloatValueType'

const types = {
  float: new FloatValueType(),
  boolean: new BooleanValueType(),
  shotFloat: new ShotFloatValueType(),
  // TODO
  // Merge in custom types here
}

export const getType = typeName => types[typeName]

