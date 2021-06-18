import { Block } from '../../framework/block'
import Validator, { ValidateRules } from '../../framework/validator'
import compiledTemplate from './login.hbs'
import '../../layouts/empty/empty'
import '../../helpers/handlebarsHelpers'
import Form, { Props as FormProps } from '../../components/form/form'
import data from './login-data'
import './login.scss'

type Props = {
    form: FormProps
}

const validateRules: ValidateRules = {
    login: [
        {
            rule: (value) => value.length > 0,
            errorMessage: 'Обязательное поле',
        },
        {
            rule: Validator.defaultRegexp.name,
            errorMessage: 'Логин содержит посторонние символы',
        },
    ],
    password: [
        {
            rule: (value) => value.length > 0,
            errorMessage: 'Обязательное поле',
        },
        {
            rule: Validator.defaultRegexp.password,
            errorMessage: 'Слишком простой',
        },
    ],
}

const validator: Validator = new Validator(validateRules)

export default class Login extends Block {
    constructor(props: Props) {
        super(props, {
            form: {
                component: Form,
                getProps: (props: Props) => ({ ...props.form, validator }),
            },
        })
    }

    render() {
        const context = this.createCompileContext()
        return compiledTemplate(context)
    }
}

const login = new Login(data)

const app = document.getElementById('app') as HTMLElement
app.append(login.getOuterElement())
