export class BaseValueType {
  doesValueMatch (value) {
    return true
  }

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

  compatibleInputs = {}

  getValueProcess (inputType) {
    const input = this.compatibleInputs[inputType]
    if (!input) {
      console.error(`[HEDRON] No ${inputType} options set for ${this.constructor.name}`)
      return
    }

    if (!input.valueProcess) {
      console.error(`[HEDRON] No ${inputType} valueProcess set for ${this.constructor.name}`)
      return
    }

    return input.valueProcess
  }

  valueProcess = {}

  parseCustomConfig = () => ({})
}
