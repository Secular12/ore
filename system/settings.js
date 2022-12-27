import { localizer } from '../lib/helpers'
import defaultMechanicSettings from './defaults/mechanicSettings.js'
import OreGeneralSettings from './documents/OreGeneralSettings'
import OreMechanicSettingsModel from './models/OreMechanicSettingsModel'

export const registerSettings = () => {
    game.settings.registerMenu('ore', 'GeneralSettings', {
        hint: localizer('GeneralSettingsHint'),
        icon: 'fas fa-user-cog',
        label: localizer('GeneralSettings'),
        name: localizer('GeneralSettings'),
        restricted: true,
        type: OreGeneralSettings,
    })

    game.settings.register('ore', 'mechanicSettings', {
        config: false,
        default: defaultMechanicSettings,
        name: localizer('MechanicSettings'),
        scope: 'world',
        type: OreMechanicSettingsModel,
    })
}