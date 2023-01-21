export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper('fieldNumber', (value, options) => {
        return new Handlebars.SafeString(
            (options.hash.label ? `<label><span class="field-label">${options.hash.label}</span>` : '') +
            `<input type="number" data-field="number" ` +
                Object.entries(options.hash)
                    .reduce((attributes, [key, value]) => {
                        if (['hint', 'label'].includes(key)) return attributes

                        if (['disabled', 'required'].includes(key) && value === true) {
                            return [...attributes, key]
                        }

                        const val = value ?? null

                        return [...attributes, val ? `${key}="${value}"` : '']
                    }, [])
                    .join(' ') +
            ` value="${value ?? ''}"` +
            `>` +
            (options.hash.label ? `</label>` : '') +
            (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '')
        )
    })
}