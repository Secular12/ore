import { registerHandlebarHelpers, } from './system/lib/handlebarHelpers.js'
import Logger from './system/lib/Logger.js'
import { registerSettings, } from './system/settings.js'

Hooks.once('init', () => {
  CONFIG.debug.logs = true

  Logger()('Initializing ORE system...')

  registerSettings()
  registerHandlebarHelpers()
})
