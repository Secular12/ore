import Logger from './lib/Logger.js'

Hooks.once('init', () => {
    CONFIG.debug.logs = true

    Logger()('Initializing ORE system...')
})
