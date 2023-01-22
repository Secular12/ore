import { round } from './helpers.js'

const numberFieldListener = function (html) {
  html
    .find('.field-number .field-input')
    .change(event => {
      const el = event.target
      
      if (!el.required && !el.value && el.value !== 0) return

      const max = el.max || el.max === 0 ? +el.max : null
      const min = el.min || el.min === 0 ? +el.min : null
      const step = +el.step
      const value = +el.value
      
      if ((min || min === 0) && value < min) {
        el.value = min
        return
      }
      
      if ((max || max === 0) && value > max) {
        el.value = max
        return
      }

      if (step) {
        el.value = round(value, step, min ?? 0)
      }
    })
}

export const fieldListeners = (html) => {
  numberFieldListener(html)
}