import path from 'path'

const userSettingsPath = path.normalize(`${__dirname}/../../user-settings.json`)
const userSettings = require(userSettingsPath)

export { userSettings }
