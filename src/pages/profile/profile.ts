import { Block } from '../../framework/block'
import compiledTemplate from './profile.hbs'
import data from './profile-data'
import '../../helpers/handlebarsHelpers'
import '../../layouts/base/base'
import './profile.scss'

export type Props = {
    profile: { category: string; content: string }[]
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
