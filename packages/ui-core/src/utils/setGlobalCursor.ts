export type CursorCSSValue =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'col-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out'

let globalCursorStyleEl: HTMLStyleElement | null = null

export const setGlobalCursor = (cursorCSSValue: CursorCSSValue) => {
  const styleEl = document.createElement('style')
  styleEl.textContent = `html, body, body * { cursor: ${cursorCSSValue} !important; }`
  document.head.appendChild(styleEl)
  globalCursorStyleEl = styleEl
}

export const clearGlobalCursor = () => {
  globalCursorStyleEl?.remove()
  globalCursorStyleEl = null
}
