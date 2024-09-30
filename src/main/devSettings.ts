import path from 'path'

const devSettingsPath = path.normalize(`${__dirname}/../../dev-settings.json`)

interface DevSettings {
  reduxDevtoolsDir?: string
}

let devSettings: DevSettings = {}

try {
  devSettings = require(devSettingsPath)
} catch {
  console.warn('No dev settings file found')
}

export { devSettings }
