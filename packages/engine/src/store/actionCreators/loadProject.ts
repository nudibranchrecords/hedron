import { EngineData, SetterCreator } from '@store/types'

export const createLoadProject: SetterCreator<'loadProject'> =
  (setState) => (project: EngineData) =>
    setState(() => project)
