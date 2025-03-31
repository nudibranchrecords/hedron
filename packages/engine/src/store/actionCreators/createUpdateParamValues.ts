import { NodeParamWithChildren, SetterCreator } from '@store/types'

export const createUpdateParamValues: SetterCreator<'updateParamValues'> =
  (setState) => (sketchId, params) => {
    setState((state) => {
      const storedParams = state.params
      Object.keys(params).forEach((key) => {
        const param = params[key]
        for (const id in storedParams) {
          const storedParam = storedParams[id]
          if (storedParam.sketchId !== sketchId || storedParam.key !== key) {
            continue
          }
          if (!Array.isArray(param)) {
            state.updateParamValue(storedParam.id, params[key])
            return
          }
          const length = Math.min(
            param.length,
            (storedParam as NodeParamWithChildren).childNodeIds.length,
          )
          for (let i = 0; i < length; i++) {
            state.updateParamValue((storedParam as NodeParamWithChildren).childNodeIds[i], param[i])
          }
          return
        }
      })
    })
  }
