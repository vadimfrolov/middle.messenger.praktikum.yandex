import { Block } from '../../framework/block'
import compiledTemplate from './message.hbs'
import data from './messages'
import '../../helpers/handlebarsHelpers'
import '../../layouts/base/base'

export type Props = {
    message: { imgSrc: string; name: string; time: string; text: string }[]
}

export default class Chat extends Block {
    constructor(props: Props) {
        super(props)
    }

    render() {
        const context = this.createCompileContext()
        return compiledTemplate(context)
    }
}

const chat = new Chat(data)

const app = document.getElementById('app') as HTMLElement
app.append(chat.getOuterElement())
