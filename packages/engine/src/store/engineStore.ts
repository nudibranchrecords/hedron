import { createStore } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { createUpdateNodeValues } from '@store/actionCreators/createUpdateNodeValues'
import { EngineStateWithActions } from '@store/types'
import { initialState } from '@store/initialState'
import { createAddSketch } from '@store/actionCreators/addSketch'
import { createDeleteSketch } from '@store/actionCreators/deleteSketch'
import { createSetSketchModuleItem } from '@store/actionCreators/setSketchModuleItem'
import { createDeleteSketchModule } from '@store/actionCreators/deleteSketchModule'
import { createUpdateSketchParams } from '@store/actionCreators/updateSketchParams'
import { createUpdateParamValue } from '@store/actionCreators/updateNodeValue'
import { createReset } from '@store/actionCreators/reset'
import { createLoadProject } from '@store/actionCreators/loadProject'
import {
  createAddInput,
  createAddInputParam,
  createDeleteInputParam,
} from '@store/actionCreators/createAddInput'

export const createEngineStore = () =>
  createStore<EngineStateWithActions>()(
    subscribeWithSelector(
      devtools(
        immer((set) => ({
          ...initialState,
          addSketch: createAddSketch(set),
          updateSketchParams: createUpdateSketchParams(set),
          setSketchModuleItem: createSetSketchModuleItem(set),
          updateParamValue: createUpdateParamValue(set),
          deleteSketch: createDeleteSketch(set),
          deleteSketchModule: createDeleteSketchModule(set),
          reset: createReset(set),
          loadProject: createLoadProject(set),
          updateNodeValues: createUpdateNodeValues(set),
          addInput: createAddInput(set),
          deleteInputParam: createDeleteInputParam(set),
          addInputParam: createAddInputParam(set),
        })),
      ),
    ),
  )

export type EngineStore = ReturnType<typeof createEngineStore>
