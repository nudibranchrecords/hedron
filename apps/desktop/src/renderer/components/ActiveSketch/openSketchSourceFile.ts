// openSketchSourceFile.ts
// Utility to open the source file for a sketch in the default program
import { appStore } from '@renderer/appStore'
import { FileEvents } from '@shared/Events'

/**
 * Attempts to open the source file (index.ts or index.js) for a sketch module in the default app.
 * @param moduleId The sketch's moduleId
 * @returns Promise<void>
 */
export async function openSketchSourceFile(moduleId: string) {
  const sketchesDir = appStore.getState().sketchesDir
  if (!sketchesDir) {
    alert('No sketches directory set')
    return
  }
  // Ask main process to open the file
  const result = await window.electronApi.ipcRenderer.invoke(
    FileEvents.OpenSketchSourceFile,
    sketchesDir,
    moduleId,
  )
  if (!result?.success) {
    alert(result?.error || 'Source file not found for this sketch.')
  }
}
