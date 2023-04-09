import Logger from './Logger.js'

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
    Logger()('rollDice.default data:', data)

    const rollResults = await getRollResults(data)

    Logger()('rollDice.default rollResults:', rollResults)

    const { diceSize } = game.settings.get('ore', 'mechanicSettings')
    
    const content = await renderTemplate('systems/ore/system/templates/chat/roll-result.html', {
        ...data,
        diceSize,
        rollResults: Object.entries(rollResults)
            .sort(([a],[b]) => b-a)
            .reduce((acc, [k, v]) => {
                if (v > 1) {
                    acc.sets.push({size: k, count: v})
                } else {
                    acc.waste.push({size: k})
                }

                return acc
            }, {sets: [], waste: []}),
        speaker: game.user,
    })

    const chatData = ChatMessage.applyRollMode({ content }, data.rollMode)
    ChatMessage.create(chatData)
}