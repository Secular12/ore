import { fieldListeners } from "../../lib/formHelpers.js"
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
            formData
        )

        const expandedData = expandObject(formData)
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings')

        const diceSizeSchema = mechanicSettings.schema.fields.diceSize

        expandedData.maxDicePoolSize = +expandedData.maxDicePoolSize
        expandedData.diceSize = diceSizeSchema.choices[expandedData.diceSize]

        Logger()('OreGeneralSettings._updateObject serialized mechanicSettings:', expandedData)
        
        await game.settings.set('ore', 'mechanicSettings', expandedData)
        
        this.render(true)
    }

    activateListeners(html) {
        super.activateListeners(html)

        Logger()('OreGeneralSettings.activateListeners html:', html)

        fieldListeners(html)
    }

    deserializeMechanicSettings () {
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings')

        Logger()('OreGenealSettings.deserializeMechanicSettings mechanicSettings:', mechanicSettings)

        const diceSizeSchema = mechanicSettings.schema.fields.diceSize
        const maxDicePoolSizeSchema = mechanicSettings.schema.fields.maxDicePoolSize
        
        const deserializedData = {
            ...mechanicSettings,
            diceSize: {
                choices: diceSizeSchema.choices,
                index: diceSizeSchema.choices
                    .findIndex(value => value === mechanicSettings.diceSize)
                    .toString(),
                value: mechanicSettings.diceSize,
            },
            maxDicePoolSize: {
                max: maxDicePoolSizeSchema.max,
                min: maxDicePoolSizeSchema.min,
                step: maxDicePoolSizeSchema.step,
                value: mechanicSettings.maxDicePoolSize
            }
        }

        Logger()('OreGenealSettings.deserializeMechanicSettings deserializedData:', deserializedData)

        return deserializedData
    }
}