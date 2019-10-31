import { FloatValueType } from './FloatValueType'
import { BooleanValueType } from './BooleanValueType'
import { ShotFloatValueType } from './ShotFloatValueType'
import { EnumValueType } from './EnumValueType'

const types = {
  float: new FloatValueType(),
  boolean: new BooleanValueType(),
  shotFloat: new ShotFloatValueType(),
  enum: new EnumValueType(),
  // TODO
  // Merge in custom types here
}

export const getType = typeName => types[typeName]

