import { fieldListeners } from '../lib/formHelpers.js'
import { localizer } from '../lib/helpers.js'
import Logger from '../lib/Logger.js'
import rollDice from '../lib/rollDice.js'

export class DicePool extends FormApplication {
    constructor() {
        super()

        const mechanicSettings = game.settings.get('ore', 'mechanicSettings')

        this.customAdd = {
            name: '',
            source: null,
            type: 'custom',
            value: 1,
        }

        this.overrideMaxDice = false
        this.defaultMaxDiceSize = mechanicSettings.maxDicePoolSize
        this.maxDiceOverride = mechanicSettings.maxDicePoolSize
        this.pool = []
        this.rollMode = game.settings.get('core', 'rollMode')
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'DicePool',
            template: 'systems/ore/system/templates/DicePool.html',
            title: localizer('DicePool'),
            classes: ['ore', 'DicePool'],
            width: 600,
            height: 'auto',
            top: 500,
            left: 20,
            resizable: true,
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true
        })
    }

    get calculatedDice () {
        return this.pool.reduce((acc, {value}) => acc + (value ?? 0), 0)
    }

    get maxDice () {
        return this.overrideMaxDice
            ? this.maxDiceOverride
            : this.defaultMaxDiceSize
    }

    get totalDice () {
        return this.calculatedDice < 0
            ? 0
            : this.calculatedDice > this.maxDice
                ? this.maxDice
                : this.calculatedDice
    }

    async getData () {
        const data = {
            calculatedDice: this.calculatedDice,
            customAdd: this.customAdd,
            maxDiceOverride: this.maxDiceOverride,
            overrideMaxDice: this.overrideMaxDice,
            pool: this.pool,
            rollMode: this.rollMode,
            totalDice: this.totalDice
        }

        Logger()('DicePool.getdata data:', data)

        return data
    }

    async _updateObject (event, formData) {
        const expandedData = expandObject(formData)

        Logger()(
            'DicePool._updateObject event, expandedData:',
            event,
            expandedData,
        )

        this.customAdd = {
            name: expandedData.customAdd.name,
            value: +(+expandedData.customAdd.value).toFixed()
        }

        this.maxDiceOverride = expandedData.maxDiceOverride ?? this.maxDiceOverride
        this.overrideMaxDice = expandedData.overrideMaxDice
        this.rollMode = expandedData.rollMode

        $('.total-dice').text(this.totalDice)
    }

    activateListeners (html) {
        super.activateListeners(html)
        fieldListeners(html)

        html
            .find('#add-custom-dice')
            .click(this._addCustomDice.bind(this))
        
        html
            .find('#clear-dice-pool')
            .click(this._clearDicePool.bind(this))

        html
            .find('#roll-dice-pool')
            .click(this._rollDicePool.bind(this))
        
        html
            .find('#override-max-dice')
            .click(this._toggleMaxDiceOverride.bind(this))
    }

    async toggle () {
        if (!this.rendered) {
            const mechanicSettings = game.settings.get('ore', 'mechanicSettings')
            this.defaultMaxDiceSize = mechanicSettings.maxDicePoolSize

            if (!this.overrideMaxDice) {
                this.maxDiceOverride = mechanicSettings.maxDicePoolSize
            }

            await this.render(true)
        } else {
            this.close()
        }
    }

    async _addCustomDice(event) {
        this.pool.push(this.customAdd)

        this.customAdd = {
            name: '',
            value: 1
        }

        this.render(true)
    }

    async _clearDicePool(event) {
        const mechanicSettings = game.settings.get('ore', 'mechanicSettings')

        this.pool = []

        this.customAdd = {
            name: '',
            source: null,
            type: 'custom',
            value: 1,
        }

        this.defaultMaxDiceSize = mechanicSettings.maxDicePoolSize
        this.overrideMaxDice = false
        this.maxDiceOverride = mechanicSettings.maxDicePoolSize

        this.render(true)
    }

    async _rollDicePool(event) {
        await rollDice({
            maxDice: this.maxDice,
            pool: this.pool,
            rollMode: this.rollMode,
            totalDice: this.totalDice
        })

        this._clearDicePool()
        this.close()
    }

    async _toggleMaxDiceOverride (event) {
        this.overrideMaxDice = !this.overrideMaxDice
        $('#max-dice-override').prop('disabled', (i, v) => !v)
    }
}