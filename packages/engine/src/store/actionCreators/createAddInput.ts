import { addNode } from '@store/shared/addNode'
import { SetterCreator, SketchConfigParamImported } from '@store/types'
import { createUniqueId } from '@utils/createUniqueId'

export const createAddInput: SetterCreator<'addInput'> =
  (setState) => (inputConfig, optionsNodeConfig) => {
    const id = createUniqueId()

    const optionNodeIds: string[] = []

    setState((state) => {
      for (const cfg of optionsNodeConfig) {
        const optionNodeId = createUniqueId()
        optionNodeIds.push(optionNodeId)

        const cfgImported = {
          ...cfg,
          valueType: cfg.valueType ?? 'number',
          groupIndex: 0,
          title: cfg.title ?? cfg.key,
          nodeType: 'param',
          // TODO: This casting is not ideal, issues tie in with `addNode` type messiness
        } as SketchConfigParamImported

        addNode(state, optionNodeId, cfgImported)
      }

      if (state.inputs[id]) {
        return
      }
      state.inputs[id] = {
        ...inputConfig,
        optionNodeIds,
        id,
        // TODO: Give inputs an (optional) sketchId so option nodes can be selected and displayed in bottom sketch panel
      }
    })

    return id
  }
