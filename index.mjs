import { registerHandlebarHelpers, } from './system/lib/handlebarHelpers.js'
import Logger from './system/lib/Logger.js'
import { registerSettings, } from './system/settings.js'
import hooks from './system/hooks'

Hooks.once('init', () => {
  CONFIG.debug.logs = true

  game.ore = {}

  Logger()('Initializing ORE system...')

  registerSettings()
  registerHandlebarHelpers()
  hooks()
})
