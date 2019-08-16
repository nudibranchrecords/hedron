import { rSettingsUpdate } from './actions'

// Some settings may depend on other settings, so we can have some listener logic
// here to auto disable/enable settings if other ones have changed
const handleSettingsUpdate = (action, store) => {
  let items = action.payload.items
  let modifiedItems = {}
  const settings = store.getState().settings

  // Force enable fullSpectrum if audioTexture is enabled
  if (items.generateAudioTexture & !settings.generateAudioTexture & !settings.computeFullSpectrum) {
    modifiedItems.computeFullSpectrum = true
  }

  // Force disable audioTexture if fullSpectrum is also disabled
  if (settings.generateAudioTexture && !items.computeFullSpectrum) {
    modifiedItems.generateAudioTexture = false
  }

  items = { ...items, ...modifiedItems }

  store.dispatch(rSettingsUpdate(items))
}

export default (action, store) => {
  switch (action.type) {
    case 'U_SETTINGS_UPDATE':
      handleSettingsUpdate(action, store)
      break
  }
}

