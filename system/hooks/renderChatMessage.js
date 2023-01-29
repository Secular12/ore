import { DicePool } from '../documents/DicePool.js'
import { displayToggle } from '../lib/helpers.js'

export default (app, html) => {
  const $rollResultMessage = html.find('.RollResult-message')

  displayToggle(html)

  if ($rollResultMessage.length) {
    html.addClass('ore RollResult')

    html
      .find('.RollResult-re-roll')
      .click(function (event) {
        const $reRollButton = $(this)
        const $message = $reRollButton.closest('.RollResult-message')
        const $pool = $message.find('.pool-item')

        const data = {
          maxDice: $message.data('maxDice'),
          pool: $pool
            .map(function () {
              const $poolItem = $(this)

              return {
                name: $poolItem.data('name'),
                source: $poolItem.data('source') ?? null,
                type: $poolItem.data('type'),
                value: $poolItem.data('value')
              }
            })
            .toArray(),
          rollMode: $message.data('rollMode'),
        }

        game.ore.DicePool.setPool(data)
      })
  }

}