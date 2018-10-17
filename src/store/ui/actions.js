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

export function uiEditingToggle (type, id) {
  return {
    type: 'UI_EDITING_TOGGLE',
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

export function uiNodeToggleOpen (id) {
  return {
    type: 'UI_NODE_TOGGLE_OPEN',
    payload: {
      id
    }
  }
}

export function uiAuxToggleOpen (id) {
  return {
    type: 'UI_AUX_TOGGLE_OPEN',
    payload: {
      id
    }
  }
}
