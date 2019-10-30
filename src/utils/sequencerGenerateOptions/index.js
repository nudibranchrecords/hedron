import uid from 'uid'
import { getType } from '../../valueTypes'

export default (nodeValueType) => {
  // Get node valueType related options
  const extraOptions = getType(nodeValueType).sequencerOptions

  return {
    grid: {
      id: uid(),
      value: [
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ...extraOptions,
  }
}
