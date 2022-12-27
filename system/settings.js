import { localizer } from '../lib/helpers.js'
import defaultMechanicSettings from './defaults/mechanicSettings.js'
import OreGeneralSettings from './documents/OreGeneralSettings.js'
import OreMechanicSettingsModel from './models/OreMechanicSettingsModel.js'

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