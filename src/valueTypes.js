import uid from 'uid'

// TODO: Everywhere types are being used should be filled with functions here. Eventually this can become
// a plugin system where custom types can be loaded in by users, following the same API

const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1

class ValueType {
  get canDoMacro () { return typeof this.macroInterpolate === 'function' }
  getTransformedValue (param) { return param.value }
  get midiOptions () { return [] }
  get lfoOptions () { return [] }
  get audioOptions () { return [] }

  // TODO
  // sequencer and anim have editable options
  // but no way to hook into the functionality
  get sequencerOptions () { return [] }
  get animOptions () { return [] }
}

class TypeFloat extends ValueType {
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

class TypeBoolean extends ValueType {
    defaultValue = false
    compatibleInputs = ['midi']
    doesValueMatch (value) {
      return typeof value === 'boolean'
    }
    macroInterpolate (s, t, i) {
      return i > 0.99 ? t : s
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

const types = {
  float: new TypeFloat(),
  boolean: new TypeBoolean(),
}

export const getType = typeName => types[typeName] || types['float']
