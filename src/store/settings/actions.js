export function settingsUpdate (items) {
  return {
    type: 'SETTINGS_UPDATE',
    payload: { items },
  }
}
