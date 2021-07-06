<<<<<<< HEAD
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
=======
import Handlebars from 'handlebars';

import { IButtonOptions, IInputOptions, ILoginPageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { getFormData, getName } from '../../utils/utils';
import { isNotEmpty, isPassword } from '../../utils/validations';
import { ActionTypes, GlobalStore } from '../../utils/store';
import errors from '../../constants/errors';
import inputNames from '../../constants/inputNames';
import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import AuthApi from '../../api/authApi';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import login from './login.html';
import './login.less';

class Login extends Block {
  constructor(rootId: string) {

    // buttons
    const loginButtonOptions: IButtonOptions = {
      buttonText: titles.ENTER,
      buttonType: 'submit',
    };

    const registerButtonOptions: IButtonOptions = {
      buttonText: titles.LINK_TO_SIGN_UP,
      buttonClass: 'button-link',
      events: {
        click: () => this._redirect()
      }
    };

    // inputs
    const loginInputOptions: IInputOptions = {
      label: titles.LOGIN,
      inputPlaceholder: titles.LOGIN_PLACEHOLDER,
      name: inputNames.LOGIN,
      validateFunctions: [isNotEmpty],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const passwordInputOptions: IInputOptions = {
      label: titles.PASSWORD,
      inputPlaceholder: titles.PASSWORD_PLACEHOLDER,
      inputType: inputNames.PASSWORD,
      name: inputNames.PASSWORD,
      validateFunctions: [isPassword],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const loginButton = new Button(loginButtonOptions);
    const registerButton = new Button(registerButtonOptions);
    const loginInput = new Input(loginInputOptions);
    const passwordInput = new Input(passwordInputOptions);
    const options = {
      person: true,
      loginButton,
      registerButton,
      loginInput,
      passwordInput,
      submitFormHandler: (event: Event) => this._enter(event),
    };
    super(options, rootId);
  }

  async componentDidMount() {
    try {
      const userInfo = await new AuthApi().getUserInfo();
      if (userInfo) {
        Router.go(redirections.CHATS);
      }
    } catch (err) {
      return;
    }
  }

  private async _enter(event: Event): Promise<void> {
    event.preventDefault();
    const form = document.forms.namedItem('login');

    if (form) {
      const data = getFormData(form);

      if ((<ILoginPageOptions> this.props).loginInput.validate() && (<ILoginPageOptions> this.props).passwordInput.validate()) {
        try {
          await new AuthApi().signin(data);
          const userInfo = await new AuthApi().getUserInfo();
          GlobalStore.dispatchAction(ActionTypes.CURRENT_USER, JSON.parse(<string>userInfo));
          Router.go(redirections.CHATS);
        } catch (err) {
          console.error(`${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
        }
      }
    }
  }

  private _redirect(): void {
    Router.go(redirections.SIGNUP);
  }

  _onChange(event: Event): void {
    const name = getName(event);

    return (this.props as {[key:string] : Block})[`${name}Input`]?.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value });
  }

  _onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this._onChange(event);
      this._enter(event);
    }
  }

  render(): string {
    const template = Handlebars.compile(login);
    const {
      elementId,
      loginButton,
      registerButton,
      loginInput,
      passwordInput
    } = this.props as ILoginPageOptions;

    return template({
      elementId: elementId,
      loginButton: loginButton.render(),
      registerButton: registerButton.render(),
      loginInput: loginInput.render(),
      passwordInput: passwordInput.render(),
      titles,
    });
  }
}

export default Login;
>>>>>>> sprint_3
