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