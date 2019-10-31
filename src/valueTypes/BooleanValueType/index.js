import uid from 'uid'
import { BaseValueType } from '../BaseValueType'

export class BooleanValueType extends BaseValueType {
    defaultValue = false

    compatibleInputs = ['midi']

    doesValueMatch (value) {
      return typeof value === 'boolean'
    }

    get midiOptions () {
      return [
        {
          title: 'Boolean Mode',
          key: 'booleanMode',
          type: 'select',
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
    }

    overrideMidiProcess ({ node, options }) {
      switch (options.booleanMode) {
        case 'returnTrue':
          return true
        case 'returnFalse':
          return false
        case 'toggle':
          return !node.value
      }
    }
}
