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

  getExtraInputOptions (inputType) {
    const { generateExtraOptions } = this.compatibleInputs[inputType]

    if (generateExtraOptions) {
      return generateExtraOptions()
    } else {
      return []
    }
  }

  valueProcess = {}
}
