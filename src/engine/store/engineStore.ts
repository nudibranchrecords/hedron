import { createStore } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { EngineStateWithActions } from './types'
import { createAddSketch } from './actionCreators/addSketch'
import { createDeleteSketch } from './actionCreators/deleteSketch'
import { createSetSketchModuleItem } from './actionCreators/setSketchModuleItem'
import { createDeleteSketchModule } from './actionCreators/deleteSketchModule'
import { createUpdateSketchParams } from './actionCreators/updateSketchParams'
import { createUpdateSelectedNode } from './actionCreators/updateSelectedNode'
import { createUpdateNodeValue } from './actionCreators/updateNodeValue'
import { createReset } from './actionCreators/reset'
import { createLoadProject } from './actionCreators/loadProject'
import { initialState } from './initialState'

export const createEngineStore = () =>
  createStore<EngineStateWithActions>()(
    subscribeWithSelector(
      devtools(
        immer((set) => ({
          ...initialState,
          addSketch: createAddSketch(set),
          updateSketchParams: createUpdateSketchParams(set),
          setSketchModuleItem: createSetSketchModuleItem(set),
          updateNodeValue: createUpdateNodeValue(set),
          updateSelectedNode: createUpdateSelectedNode(set),
          deleteSketch: createDeleteSketch(set),
          deleteSketchModule: createDeleteSketchModule(set),
          reset: createReset(set),
          loadProject: createLoadProject(set),
        })),
      ),
    ),
  )

export type EngineStore = ReturnType<typeof createEngineStore>
