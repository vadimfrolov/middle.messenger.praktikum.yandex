import { ChildrenProps } from './block'

export function conventerToHtml(html: string): DocumentFragment {
    var template = document.createElement('template')

    html = html.trim()

    template.innerHTML = html

    return template.content
}
