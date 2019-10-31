import { FloatValueType } from './FloatValueType'
import { BooleanValueType } from './BooleanValueType'

const types = {
  float: new FloatValueType(),
  boolean: new BooleanValueType(),
  // TODO
  // Merge in custom types here
}

export const getType = typeName => types[typeName] || types['float']

