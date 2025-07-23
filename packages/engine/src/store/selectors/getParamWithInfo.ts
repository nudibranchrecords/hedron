import { getParamConfig } from '@store/selectors/getParamConfig'
import { EngineState, Param } from '@store/types'

export type ParamWithInfo = Param & { title: string }

export const getParamWithInfo =
  (paramId: string) =>
  (state: EngineState): ParamWithInfo | null => {
    const param = state.nodes[paramId]
    if (!param) return null

    const paramConfig = getParamConfig(paramId)(state)

    if (!paramConfig) return null

    const title = paramConfig.title ?? paramConfig.key

    return { ...param, title }
  }
