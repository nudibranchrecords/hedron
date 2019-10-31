export class BaseValueType {
  get canDoMacro () {
    return typeof this.macroInterpolate === 'function'
  }

  getTransformedValue (param) {
    return param.value
  }

  macroInterpolate (v0, v1, t) {
    return t > 0.99 ? v1 : v0
  }

  get midiOptions () { return [] }
  get lfoOptions () { return [] }
  get audioOptions () { return [] }

  // TODO
  // sequencer and anim have editable options
  // but no way to hook into the functionality
  get sequencerOptions () { return [] }
  get animOptions () { return [] }
}
