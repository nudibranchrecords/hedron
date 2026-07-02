import { createStore } from 'zustand/vanilla'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { createDeleteNode } from './actionCreators/createDeleteNode'
import { EngineStateWithActions } from '@store/types'
import { initialState } from '@store/initialState'
import { createAddSketch } from '@store/actionCreators/addSketch'
import { createSetSketchModuleItem } from '@store/actionCreators/setSketchModuleItem'
import { createDeleteSketchModule } from '@store/actionCreators/deleteSketchModule'
import { createReconcileSketchNodes } from '@store/actionCreators/createReconcileSketchNodes'
import {
  createUpdateMultipleParamValues,
  createUpdateParamValue,
} from '@store/actionCreators/updateParamValue'
import { createReset } from '@store/actionCreators/reset'
import { createLoadProject } from '@store/actionCreators/loadProject'
import { createAddInput } from '@store/actionCreators/createAddInput'
import { createUpdateSketch } from '@store/actionCreators/updateSketch'
import { createMoveSketchDown, createMoveSketchUp } from '@store/actionCreators/moveSketchOrder'

export const createEngineStore = () =>
  createStore<EngineStateWithActions>()(
    subscribeWithSelector(
      devtools(
        immer<EngineStateWithActions>((set) => ({
          ...initialState,
          addSketch: createAddSketch(set),
          updateSketch: createUpdateSketch(set),
          reconcileSketchNodes: createReconcileSketchNodes(set),
          setSketchModuleItem: createSetSketchModuleItem(set),
          updateParamValue: createUpdateParamValue(set),
          updateMultipleParamValues: createUpdateMultipleParamValues(set),
          deleteSketchModule: createDeleteSketchModule(set),
          moveSketchUp: createMoveSketchUp(set),
          moveSketchDown: createMoveSketchDown(set),
          reset: createReset(set),
          loadProject: createLoadProject(set),
          addInput: createAddInput(set),
          deleteNode: createDeleteNode(set),
        })),
        {
          name: 'Hedron Engine',
          // TODO: make this configurable for users of the engine
          enabled: true,
          // Actions ignored by devtools if they `ignore/` at the start of their action name
          actionsDenylist: ['ignore/.*'],
        },
      ),
    ),
  )

export type EngineStore = ReturnType<typeof createEngineStore>
