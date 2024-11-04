import { EngineData, SetterCreator } from '@engine/store/types'

export const createLoadProject: SetterCreator<'loadProject'> =
  (setState) => (project: EngineData) =>
    setState(() => project)
