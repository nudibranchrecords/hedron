import { EngineState, EngineStateWithActions, EngineData } from '@engine/store/types'

export const stripForSave = (state: EngineStateWithActions): EngineData => {
  // @ts-expect-error ---
  const withoutActions: EngineState = {}

  Object.entries(state).forEach(([key, data]) => {
    if (typeof data === 'function') return

    // @ts-expect-error ---
    withoutActions[key] = data
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sketchModules, isSketchModulesReady, ...data } = withoutActions

  return data
}
