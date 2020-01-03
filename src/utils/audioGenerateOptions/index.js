import uid from 'uid'
import { getType } from '../../valueTypes'

export default (nodeValueType) => {
  // Get node valueType related options
  const extraOptions = getType(nodeValueType).getExtraInputOptions('audio')

  return [
    {
      title: 'Audio Band',
      key: 'audioBand',
      valueType: 'enum',
      id: uid(),
      value: 0,
      inputLinkIds: [],
      subNode: true,
      options: [
        {
          value: 0,
          label: 'Low',
        },
        {
          value: 1,
          label: 'Low-Mid',
        },
        {
          value: 2,
          label: 'Mid',
        },
        {
          value: 3,
          label: 'High',
        },
      ],
    },
    ...extraOptions,
  ]
}
