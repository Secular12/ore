import { localizer } from '../lib/helpers'

export const registerSettings = () => {
    game.settings.registerMenu('ore', 'GeneralSettings', {
        hint: localizer('GeneralSettingsHint'),
        icon: 'fas fa-user-cog',
        label: localizer('GeneralSettings'),
        name: localizer('GeneralSettings'),
        restricted: true,
        type: OreGeneralSettings,
    })
}