import { ParamValue } from '@hedron-gl/engine'
import { useEngineStore } from './engineHooks'

export const useParamValue = <T extends ParamValue>(paramId: string): T => {
  return useEngineStore((state) => state.paramValues[paramId] as T)
}
