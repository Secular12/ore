import { localizer } from './helpers.js'
import Logger from './Logger.js'

const dicePicker = async ({ diceSize, rollResults }) => {
    const content = await renderTemplate('system/ore/system/templates/dialog/dice-picker.html', {
        diceSize, rollResults
    })

    return new Promise((resolve, reject) => {
        new Dialog({
            buttons: {
                confirm: {
                    callback (html) {

                    },
                    icon: '<i class="fas fa-check"></i>',
                    label: localizer('Confirm'),
                }
            },
            content,
            default: 'confirm',
            render (html) {
                
            },
            title: localizer('VerifyYourResults'),
        }, {
            classes: [],
            jQuery: true,
        })
            .render(true)
    })
}

const getRollFormula = (totalDice) => {
    const mechanicSettings = game.settings.get('ore', 'mechanicSettings')
    return `${totalDice}d${mechanicSettings.diceSize}`
}

const getRollResults = async ({ totalDice, rollMode }) => {
    const rollFormula = getRollFormula(totalDice)

    const r = new Roll(rollFormula)

    const roll = await r.evaluate({ async: true })

    if (game.dice3d) {
        const synchronize = rollMode !== 'selfroll'
        const whisper = ['gmroll', 'blindroll'].includes(rollMode)
            ? game.users.filter(u => u.isGM).map(u => u.id)
            : null
        const blind = rollMode === 'blindroll'
        game.dice3d.showForRoll(r, game.user, synchronize, whisper, blind)
    }

    Logger()('rollDice.getRollResults roll:', roll)

    const rollResults = roll.terms[0].results
        .map(die => die.result)

    return rollResults
        .reduce((results, result) => {
            return {
                ...results,
                [result]: (results[result] ?? 0) + 1
            }
        }, {})
}

export default async function (data) {
    Logger()('rollDice.default dicePool, rollMode:', data)

    const rollResults = await getRollResults(data)

    Logger()('rollDice.default rollResults:', rollResults)

    const { diceSize } = game.settings.get('ore', 'mechanicSettings')

    // await dicePicker({ diceSize, rollResults })

    console.log(Object.entries(rollResults)
    .sort(([a],[b]) => b-a)
    .map(([k, v]) => ({size: k, count: v})))
    
    const content = await renderTemplate('systems/ore/system/templates/chat/roll-result.html', {
        ...data,
        diceSize,
        rollResults: Object.entries(rollResults)
            .sort(([a],[b]) => b-a)
            .map(([k, v]) => ({size: k, count: v})),
        speaker: game.user,
    })

    ChatMessage.applyRollMode({ content }, data.rollMode)
    ChatMessage.create({ content })
}