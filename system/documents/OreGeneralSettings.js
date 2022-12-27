import { localizer } from "../../lib/helpers.js"
import Logger from "../../lib/Logger.js"

export default class OreGeneralSettings extends FormApplication {
    constructor() {
        super()
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['ore', 'general-settings', 'settings'],
            closeOnSubmit: false,
            height: 900,
            id: 'general-settings',
            left: 400,
            resizable: true,
            submitOnChange: true,
            submitOnClose: true,
            template: 'systems/ore/system/templates/OreGeneralSettings.html',
            title: localizer('GeneralSettings'),
            top: 200,
            width: 600,
        })
    }

    getData() {
        return {}
    }

    async _updateObject(event, formData) {
    }

    activateListeners(html) {
        super.activateListeners(html)

        Logger()('OreGeneralSettings.activateListeners html:', html)
    }
}