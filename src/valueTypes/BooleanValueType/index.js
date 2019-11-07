import uid from 'uid'
import { BaseValueType } from '../BaseValueType'
import getNode from '../../selectors/getNode'
import ParamCheckboxContainer from './container'

export class BooleanValueType extends BaseValueType {
  defaultValue = false

  Component = ParamCheckboxContainer

  doesValueMatch (value) {
    return typeof value === 'boolean'
  }

  compatibleInputs = {
    midi: {
      generateExtraOptions: () => {
        return [
          {
            title: 'Boolean Mode',
            key: 'booleanMode',
            valueType: 'enum',
            id: uid(),
            value: 'toggle',
            inputLinkIds: [],
            subNode: true,
            options: [
              {
                value: 'toggle',
                label: 'Toggle',
              },
              {
                value: 'returnTrue',
                label: 'True',
              },
              {
                value: 'returnFalse',
                label: 'False',
              },
            ],
          },
        ]
      },
      valueProcess: ({ node, options }) => {
        switch (options.booleanMode) {
          case 'returnTrue':
            return true
          case 'returnFalse':
            return false
          case 'toggle':
            return !node.value
        }
      },
    },
    'seq-step': {
      valueProcess: ({ value, inputLink, store }) => {
        const seqNode = getNode(store.getState(), inputLink.sequencerGridId)
        return seqNode.value[value] === 1
      },
    },
  }
}
