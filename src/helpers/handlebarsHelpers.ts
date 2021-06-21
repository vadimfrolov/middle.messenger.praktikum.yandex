import Handlebars from 'handlebars/dist/handlebars.runtime'

Handlebars.registerHelper('and', function (...args) {
    return args.every(arg => !!arg)
})

Handlebars.registerHelper('component', function (name, components) {
    const id = components[name]
    if (!id) {
        return ''
    }
    return new Handlebars.SafeString(`<div data-replace-id=${id}></div>`)
})
