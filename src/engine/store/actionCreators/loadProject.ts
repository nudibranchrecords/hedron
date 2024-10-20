import { EngineData, SetterCreator } from '../types'

export const createLoadProject: SetterCreator<'loadProject'> =
  (setState) => (project: EngineData) =>
    setState(() => project)
