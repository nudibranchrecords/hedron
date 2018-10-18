export function displaysListUpdate (deviceList) {
  return {
    type: 'DISPLAYS_LIST_UPDATE',
    payload: { deviceList },
  }
}
