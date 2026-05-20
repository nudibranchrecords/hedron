import type { ReactElement } from 'react'
import { useGlobalDialog } from '@components/GlobalDialogs/useGlobalDialog'
import { SketchModulesDialog } from '@components/GlobalDialogs/SketchModulesDialog/SketchModulesDialog'
import { SketchBuildErrorDialog } from '@components/GlobalDialogs/SketchBuildErrorDialog'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'
import { DialogId } from '@renderer/appStore'

const dialogs: { [key in DialogId]: (props: GlobalDialogProps) => ReactElement } = {
  sketchModules: SketchModulesDialog,
  sketchesServerBuildResult: SketchBuildErrorDialog,
}

export const GlobalDialogs = () => {
  const { dialogId, closeDialog } = useGlobalDialog()
  const Component = dialogId && dialogs[dialogId]
  return Component && <Component closeDialog={closeDialog} />
}
