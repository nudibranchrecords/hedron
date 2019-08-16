export function uSettingsUpdate (items) {
  return {
    type: 'U_SETTINGS_UPDATE',
    payload: { items },
  }
}

export function rSettingsUpdate (items) {
  return {
    type: 'R_SETTINGS_UPDATE',
    payload: { items },
  }
}
