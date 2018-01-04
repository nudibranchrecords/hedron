export function uiPanelResize (panelName, value) {
  return {
    type: 'UI_PANEL_RESIZE',
    payload: {
      panelName, value
    }
  }
}
