import { ProjectData, SetterCreator } from '../types'

export const createLoadProject: SetterCreator<'loadProject'> =
  (setState) => (project: ProjectData) =>
    setState(() => project)
