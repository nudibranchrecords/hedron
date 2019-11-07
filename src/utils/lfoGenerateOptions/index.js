import uid from 'uid'
import { getType } from '../../valueTypes'

export default (nodeValueType) => {
  // Get node valueType related options
  const extraOptions = getType(nodeValueType).getExtraInputOptions('lfo')

  return [
    {
      title: 'Shape',
      id: uid(),
      key: 'shape',
      value: 'sine',
      valueType: 'enum',
      inputLinkIds: [],
      subNode: true,
      options: [
        {
          value: 'sine',
          label: 'Sine',
        },
        {
          value: 'square',
          label: 'Square',
        },
        {
          value: 'sawtooth',
          label: 'Sawtooth',
        },
        {
          value: 'rSawtooth',
          label: 'Revese Sawtooth',
        },
        {
          value: 'triangle',
          label: 'Triangle',
        },
        {
          value: 'noise',
          label: 'Noise',
        },
      ],
    },
    {
      title: 'Rate',
      id: uid(),
      key: 'rate',
      value: 1,
      valueType: 'enum',
      inputLinkIds: [],
      subNode: true,
      options: [
        {
          value: 32,
          label: '32',
        },
        {
          value: 16,
          label: '16',
        },
        {
          value: 8,
          label: '8',
        },
        {
          value: 4,
          label: '4',
        },
        {
          value: 2,
          label: '2',
        },
        {
          value: 1,
          label: '1',
        },
        {
          value: 1 / 2,
          label: '1/2',
        },
        {
          value: 1 / 4,
          label: '1/4',
        },
        {
          value: 1 / 8,
          label: '1/8',
        },
        {
          value: 1 / 16,
          label: '1/16',
        },
        {
          value: 1 / 32,
          label: '1/32',
        },
      ],
    },
    {
      title: 'Phase',
      id: uid(),
      key: 'phase',
      value: 0,
      inputLinkIds: [],
      subNode: true,
    },
    {
      title: 'Seed',
      id: uid(),
      key: 'seed',
      value: -1,
      valueType: 'enum',
      inputLinkIds: [],
      subNode: true,
      options: (() => {
        let options = []
        for (let i = -1; i < 25; i++) {
          options.push({
            value: i,
            label: i === -1 ? 'auto' : i.toString(),
          })
        }
        return options
      })(),
    },
    ...extraOptions,
  ]
}
