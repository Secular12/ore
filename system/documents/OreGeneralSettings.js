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
        const mechanicSettings = this.deserializeMechanicSettings()
        
        const data = {
            mechanicSettings,
        }

        Logger()('OreGeneralSettings.getData data', data)
        
        return data 
    }

    async _updateObject(event, formData) {
        Logger()(
            'OreGeneralSettings._updateObject event, formData',
            event,
            formData,
            'OreGeneralSettings._updateObject event.target.name',
            event.target.name
        )

        if (['diceSize'].includes(event.target.name)) {
            const mechanicSettings = this.serializeMechanicSettings(formData)

            await game.settings.set('ore', 'mechanicSettings', mechanicSettings)

            this.render(true)
        }
    }

    activateListeners(html) {
        super.activateListeners(html)

        Logger()('OreGeneralSettings.activateListeners html:', html)
    }

    deserializeMechanicSettings () {
        const diceSizeChoices = mechanicSettings.schema.fields.diceSize.choices
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings')
        
        const deserializedData = {
            ...mechanicSettings,
            diceSizeChoices,
            diceSizeIndex: diceSizeChoices
                .findIndex(value => value === mechanicSettings.diceSize)
                .toString()
        }

        Logger()('OreGenealSettings.deserializeMechanicSettings serializedData:', deserializedData)

        return deserializedData
    }

    serializeMechanicSettings (data) {
        const diceSizeChoices = mechanicSettings.schema.fields.diceSize.choices
        const expandedData = expandObject(data)
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings')

        const serializedData = {
            ...mechanicSettings,
            diceSize: diceSizeChoices[expandedData.diceSize]
        }

        Logger()('OreGenealSettings.serializeMechanicSettings serializedData:', serializedData)
        
        return serializedData
    }
}