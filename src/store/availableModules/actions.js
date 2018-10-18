export function availableModulesReplaceAll (modules) {
  return {
    type: 'AVAILABLE_MODULES_REPLACE_ALL',
    payload: { modules },
  }
}
