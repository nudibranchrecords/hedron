import getInputLinkMidiOptionIds from '../getInputLinkMidiOptionIds'

test('(Selector) getInputLinkMidiOptionIds', () => {
  let state, actual, expected

  state = {
    nodes: {
      xxx: {
        optionIds: ['opt1_sensitivity', 'opt2_controlType', 'opt3', 'opt4_messageType'],
        nodeId: 'node_y',
      },
      node_y: {
        valueType: 'float',
      },
      opt1_sensitivity: {
        key: 'sensitivity',
        id: 'opt1_sensitivity',
      },
      opt2_controlType: {
        key: 'controlType',
        id: 'opt2_controlType',
        value: 'rel1',
      },
      opt3: {},
      opt4_messageType: {
        key: 'messageType',
        id: 'opt4_messageType',
        value: 'controlChange',
      },
    },
  }

  actual = getInputLinkMidiOptionIds(state, 'xxx')
  expected = ['opt1_sensitivity', 'opt2_controlType', 'opt3', 'opt4_messageType']

  // Returns all option Ids
  expect(actual).toEqual(expected)

  state = {
    nodes: {
      xxx: {
        optionIds: ['opt1_sensitivity', 'opt2_controlType', 'opt3', 'opt4_messageType'],
      },
      opt1_sensitivity: {
        key: 'sensitivity',
        id: 'opt1_sensitivity',
      },
      opt2_controlType: {
        key: 'controlType',
        id: 'opt2_controlType',
        value: 'abs',
      },
      opt3: {},
      opt4_messageType: {
        key: 'messageType',
        id: 'opt4_messageType',
        value: 'controlChange',
      },
    },
  }

  actual = getInputLinkMidiOptionIds(state, 'xxx')
  expected = ['opt2_controlType', 'opt3', 'opt4_messageType']

  // Filters out MIDI sensitivity option because inputLink has abs controlType
  expect(actual).toEqual(expected)

  state = {
    nodes: {
      xxx: {
        optionIds: ['opt2_controlType', 'opt1_sensitivity', 'opt3', 'opt4_messageType'],
      },
      opt1_sensitivity: {
        key: 'sensitivity',
        id: 'opt1_sensitivity',
      },
      opt2_controlType: {
        key: 'controlType',
        id: 'opt2_controlType',
        value: 'abs',
      },
      opt3: {},
      opt4_messageType: {
        key: 'messageType',
        id: 'opt4_messageType',
        value: 'controlChange',
      },
    },
  }

  actual = getInputLinkMidiOptionIds(state, 'xxx')
  expected = ['opt2_controlType', 'opt3', 'opt4_messageType']

  // Filters out MIDI sensitivity option because inputLink has abs controlType
  // (sensitivity ID in different index)
  expect(actual).toEqual(expected)

  state = {
    nodes: {
      xxx: {
        optionIds: ['opt2_controlType', 'opt1_sensitivity', 'opt4_messageType'],
      },
      opt1_sensitivity: {
        key: 'sensitivity',
        id: 'opt1_sensitivity',
      },
      opt2_controlType: {
        key: 'controlType',
        id: 'opt2_controlType',
        value: 'abs',
      },
      opt4_messageType: {
        key: 'messageType',
        id: 'opt4_messageType',
        value: 'noteOn',
      },
    },
  }

  actual = getInputLinkMidiOptionIds(state, 'xxx')
  expected = ['opt4_messageType']

  // Filters out MIDI sensitivity and controlType if messageType is not 'controlChange'
  expect(actual).toEqual(expected)
})
