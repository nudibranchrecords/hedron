import { DialogId } from 'src/engine/store/types'
import { useGlobalDialog } from './useGlobalDialog'
import { SketchModulesDialog } from './SketchModulesDialog'
import { GlobalDialogProps } from './types'

const dialogs: { [key in DialogId]: (props: GlobalDialogProps) => JSX.Element } = {
  sketchModules: SketchModulesDialog,
}

export const GlobalDialogs = () => {
  const { dialogId, closeDialog } = useGlobalDialog()
  const Component = dialogId && dialogs[dialogId]
  return Component && <Component closeDialog={closeDialog} />
}
