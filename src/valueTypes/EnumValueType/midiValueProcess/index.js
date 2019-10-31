import { getMidiValue } from '../../../utils/getMidiValue'

export default ({ node, value: midiValue, options: midiOptions }) => {
  const opts = node.options
  const maxLength = opts.length
  let index = opts.findIndex(item => item.value === node.value)
  const oldVal = index / maxLength
  const newVal = getMidiValue(oldVal, midiValue, midiOptions, 15)

  if (midiOptions.controlType === 'abs') {
    index = Math.floor(newVal * maxLength)
  } else {
    if (newVal > oldVal) {
      index++
    } else {
      index--
    }
  }
  index = Math.max(0, Math.min(maxLength - 1, index))
  return opts[index].value
}
