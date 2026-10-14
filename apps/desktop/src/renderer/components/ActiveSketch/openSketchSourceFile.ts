import { FileEvents } from '@shared/Events'

/**
 * Opens the source file (index.ts or index.js) for a sketch module in the default app.
 * @param moduleId The sketch's moduleId
 */
export async function openSketchSourceFile(moduleId: string) {
  try {
    const result = await window.electronApi.ipcRenderer.invoke(
      FileEvents.OpenSketchSourceFile,
      moduleId,
    )
    if (!result?.success) {
      alert(result?.error || 'Source file not found for this sketch.')
    }
  } catch (error) {
    alert(`Failed to open source file: ${error instanceof Error ? error.message : error}`)
  }
}
