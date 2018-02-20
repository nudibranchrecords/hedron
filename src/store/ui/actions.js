export function uiPanelResize (panelName, value) {
  return {
    type: 'UI_PANEL_RESIZE',
    payload: {
      panelName, value
    }
  }
}

export function uiEditingOpen (type, id) {
  return {
    type: 'UI_EDITING_OPEN',
    payload: {
      type, id
    }
  }
}

export function uiEditingClose () {
  return {
    type: 'UI_EDITING_CLOSE'
  }
}
