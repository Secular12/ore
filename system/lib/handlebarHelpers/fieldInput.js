export default (type) => (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
  ]

  return new Handlebars.SafeString(
    (options.hash.label ? '<label' : '<div') +
    ` class="field field-${type}` +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">'+
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    `<input type="${type}" ` +
    Object.entries(options.hash)
      .reduce((attributes, [key, value]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required'].includes(key) && value === true) {
          return [...attributes, key]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-input ${value}"`
          return attributes
        }

        const val = value ?? null

        return [...attributes, val ? `${key}="${value}"` : '']
      }, ['class="field-input"'])
      .join(' ') +
    ` value="${value ?? ''}"` +
    `>` +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '')
  )
}