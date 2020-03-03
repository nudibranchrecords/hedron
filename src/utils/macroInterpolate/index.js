import { getType } from '../../valueTypes'

export default (s, t, i, valueType) => getType(valueType).macroInterpolate(s, t, i)
