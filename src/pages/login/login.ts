import { IButtonOptions, IInputOptions, ILoginPageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { getFormData, getName, showAlert } from '../../utils/utils';
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
          showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
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
    const {
      elementId,
      loginButton,
      registerButton,
      loginInput,
      passwordInput
    } = this.props as ILoginPageOptions;

    return login({
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
