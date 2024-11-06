import { createStore } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { EngineStateWithActions } from '@hedron/engine/store/types'
import { initialState } from '@hedron/engine/store/initialState'
import { createAddSketch } from '@hedron/engine/store/actionCreators/addSketch'
import { createDeleteSketch } from '@hedron/engine/store/actionCreators/deleteSketch'
import { createSetSketchModuleItem } from '@hedron/engine/store/actionCreators/setSketchModuleItem'
import { createDeleteSketchModule } from '@hedron/engine/store/actionCreators/deleteSketchModule'
import { createUpdateSketchParams } from '@hedron/engine/store/actionCreators/updateSketchParams'
import { createUpdateNodeValue } from '@hedron/engine/store/actionCreators/updateNodeValue'
import { createReset } from '@hedron/engine/store/actionCreators/reset'
import { createLoadProject } from '@hedron/engine/store/actionCreators/loadProject'

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
