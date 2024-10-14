import { createStore } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { EngineStateWithActions } from '@engine/store/types'
import { createAddSketch } from '@engine/store/actionCreators/addSketch'
import { createSetSketchModuleItem } from '@engine/store/actionCreators/setSketchModuleItem'
import { createUpdateNodeValue } from '@engine/store/actionCreators/updateNodeValue'
import { createDeleteSketchModule } from '@engine/store/actionCreators/deleteSketchModule'
import { createDeleteSketch } from '@engine/store/actionCreators/deleteSketch'
import { createUpdateSketchParams } from '@engine/store/actionCreators/updateSketchParams'
import { createReset } from '@engine/store/actionCreators/reset'
import { createLoadProject } from '@engine/store/actionCreators/loadProject'
import { initialState } from '@engine/store/initialState'

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
          deleteSketch: createDeleteSketch(set),
          deleteSketchModule: createDeleteSketchModule(set),
          reset: createReset(set),
          loadProject: createLoadProject(set),
        })),
      ),
    ),
  )

export type EngineStore = ReturnType<typeof createEngineStore>
