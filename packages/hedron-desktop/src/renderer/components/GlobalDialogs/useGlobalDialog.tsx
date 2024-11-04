import { useCallback } from 'react'
import { DialogId } from '@engine/store/types'
import { useAppStore } from '@renderer/appStore'

export const useGlobalDialog = (id?: DialogId) => {
  const dialogId = useAppStore((state) => state.globalDialogId)
  const setGlobalDialogId = useAppStore((state) => state.setGlobalDialogId)
  const isOpen = dialogId === id

  const openDialog = useCallback(() => {
    if (!id)
      throw new Error('openDialog can only be used when useGlobalDialog has id parameter set')

    setGlobalDialogId(id)
  }, [id, setGlobalDialogId])

  const closeDialog = useCallback(() => {
    setGlobalDialogId(null)
  }, [setGlobalDialogId])

  return {
    dialogId,
    isOpen,
    openDialog,
    closeDialog,
  }
}
