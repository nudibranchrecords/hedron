import { useGlobalDialog } from '@components/GlobalDialogs/useGlobalDialog'
import { SketchModulesDialog } from '@components/GlobalDialogs/SketchModulesDialog'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'
import { DialogId } from '@engine/store/types'

const dialogs: { [key in DialogId]: (props: GlobalDialogProps) => JSX.Element } = {
  sketchModules: SketchModulesDialog,
}

export const GlobalDialogs = () => {
  const { dialogId, closeDialog } = useGlobalDialog()
  const Component = dialogId && dialogs[dialogId]
  return Component && <Component closeDialog={closeDialog} />
}
