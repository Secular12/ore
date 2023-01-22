import fieldInput from './handlebarHelpers/fieldInput.js';
import fieldSelect from './handlebarHelpers/fieldSelect.js';

export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper({
        add: (a, b) => +a + +b,
        get: (list, key) => list[key] ?? false,
        length: (value) => value?.length ?? null,
        sub: (a, b) => +a - +b,
        tern: (a, b, c) => a ? b : c,
    }),
    Handlebars.registerHelper('times', (n, block) => {
        let accum = '';
        for(let i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum
    })
    Handlebars.registerHelper('fieldNumber', fieldInput('number'))
    Handlebars.registerHelper('fieldSelect', fieldSelect)
    Handlebars.registerHelper('fieldText', fieldInput('text'))
}