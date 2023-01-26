export const displayToggle = (html) => {
  console.log('hello')
  html
    .find('.display-toggle')
    .click(function (event) {
      const $chevronIcon = $(this).find('.fa')
      const { target } = event.currentTarget.dataset

      $chevronIcon.toggleClass('fa-chevron-down fa-chevron-up')
      html.find(target).toggleClass('hide')
    })
}

export const isObject = value => (
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value)
)

export const localizer = target => game.i18n.localize(target)

const rounding = (dir = null) => (number, increment, offset) => {
  const roundingDir = dir ?? 'round'
  if (!increment) return number
  return Math[roundingDir]((number - offset) / increment ) * increment + offset
}

export const round = rounding()