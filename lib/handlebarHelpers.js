export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper({
        and: (a, b) => a && b,
        eq: (a, b) => a === b,
        or: (a, b) => a || b,
    })
  
    Handlebars.registerHelper('concat', function (...args) {
        return args.reduce((acc, current) => {
            return typeof current !== 'object'
                ? `${acc}${current}`
                : acc
        }, '')
    })
}