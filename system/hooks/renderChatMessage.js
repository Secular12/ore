import { displayToggle } from '../lib/helpers.js'

export default (app, html) => {
  const $rollResultMessage = html.find('.RollResult-message')

  if ($rollResultMessage.length) {
    html.addClass('ore RollResult')
  }

  displayToggle(html)
}