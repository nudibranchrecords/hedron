export type Result<T> =
  | { success: true; data: T; error: undefined }
  | { success: false; error: string; data: undefined }

export type PerformanceMonitor = {
  begin: () => void
  end: () => void
  showPanel: (panelNumber: number) => void
  dom: HTMLElement
}
