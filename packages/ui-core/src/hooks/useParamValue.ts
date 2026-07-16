import { ParamValue } from '@hedron-gl/engine'
import { useEngineStore } from './engineHooks'

/**
 * Returns a param value from engine state.
 *
 * Overloads:
 * - When `paramId` is a definite string, `defaultValue` is optional and the return type is `T | undefined`.
 * - When `paramId` can be `null` or `undefined`, `defaultValue` is required and the return type is `T`.
 */
export function useParamValue<T extends ParamValue>(paramId: string): T | undefined
export function useParamValue<T extends ParamValue>(
  paramId: string | undefined | null,
  defaultValue: T,
): T
export function useParamValue<T extends ParamValue>(
  paramId: string | undefined | null,
  defaultValue?: T,
): T | undefined {
  return useEngineStore((state) =>
    paramId ? ((state.paramValues[paramId] as T | undefined) ?? defaultValue) : defaultValue,
  )
}
