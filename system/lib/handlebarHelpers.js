export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper({
        add: (a, b) => +a + +b,
        get: (list, key) => list[key] ?? false,
        length: (value) => value?.length ?? null,
        sub: (a, b) => +a - +b,
    }),
    Handlebars.registerHelper('times', (n, block) => {
        let accum = '';
        for(let i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum
    })
    Handlebars.registerHelper('fieldNumber', (value, options) => {
        return new Handlebars.SafeString(
            (options.hash.label ? '<label' : '<div') +
            ' class="ore-field ore-field-number' +
            (options.hash.class ? ` ${options.hash.class}` : '') +
            '">'+
            (options.hash.label ? `<span class="ore-field-label ore-field-number-label` : '') +
            (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
            (options.hash.label ? `">${options.hash.label}</span>` : '') +
            '<input type="number" data-field="number" ' +
                Object.entries(options.hash)
                    .reduce((attributes, [key, value]) => {
                        if (['hint', 'label', 'class'].includes(key)) return attributes

                        if (['disabled', 'required'].includes(key) && value === true) {
                            return [...attributes, key]
                        }

                        if (key === 'inputClass') {
                            return [...attributes, `class="${value}"`]
                        }

                        const val = value ?? null

                        return [...attributes, val ? `${key}="${value}"` : '']
                    }, [])
                    .join(' ') +
            ` value="${value ?? ''}"` +
            `>` +
            (options.hash.label ? `</label>` : '</div>') +
            (options.hash.hint ? `<p class="ore-field-hint ore-field-number-hint">${options.hash.hint}</p>` : '')
        )
    })
}