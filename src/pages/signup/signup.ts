import Handlebars from 'handlebars';

import errors from '../../constants/errors';
import inputNames from '../../constants/inputNames';
import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import { IButtonOptions, IInputOptions, ISignupPageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { getFormData, getName } from '../../utils/utils';
import { isEmail, isNotEmpty, isPassword, isPasswordSame, isPhone } from '../../utils/validations';
import AuthApi from '../../api/authApi';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import signup from './signup.html';
import '../login/login.less';

class Signup extends Block {
  constructor(rootId: string) {

    // buttons
    const signupButtonOptions: IButtonOptions = {
      buttonText: titles.SIGNUP,
      buttonType: 'submit',
    };

    const rememberAllButtonOptions: IButtonOptions = {
      buttonText: titles.REMEMBER_ALL,
      buttonClass: 'button-link',
      events: { click: () => this._redirect() }
    };

    // inputs
    const emailInputOptions: IInputOptions = {
      label: titles.EMAIL,
      inputPlaceholder: titles.EMAIL_PLACEHOLDER,
      inputType: inputNames.EMAIL,
      name: inputNames.EMAIL,
      validateFunctions: [isEmail],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

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

    const nameInputOptions: IInputOptions = {
      label: titles.NAME,
      inputPlaceholder: titles.NAME_PLACEHOLDER,
      name: inputNames.NAME,
      validateFunctions: [isNotEmpty],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const surnameInputOptions: IInputOptions = {
      label: titles.SURNAME,
      inputPlaceholder: titles.SURNAME_PLACEHOLDER,
      name: inputNames.SURNAME,
      validateFunctions: [isNotEmpty],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const phoneInputOptions: IInputOptions = {
      label: titles.PHONE,
      inputPlaceholder: titles.PHONE_PLACEHOLDER,
      name: inputNames.PHONE,
      validateFunctions: [isPhone],
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

    const passwordRepeatInputOptions: IInputOptions = {
      label: titles.PASSWORD_REPEAT,
      inputPlaceholder: titles.PASSWORD_REPEAT_PLACEHOLDER,
      inputType: inputNames.PASSWORD,
      name: inputNames.PASSWORD_REPEAT,
      validateFunctions: [isPasswordSame],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const signupButton = new Button(signupButtonOptions);
    const rememberAllButton = new Button(rememberAllButtonOptions);

    const emailInput = new Input(emailInputOptions);
    const loginInput = new Input(loginInputOptions);
    const nameInput = new Input(nameInputOptions);
    const surnameInput = new Input(surnameInputOptions);
    const phoneInput = new Input(phoneInputOptions);
    const passwordInput = new Input(passwordInputOptions);
    const passwordRepeatInput = new Input(passwordRepeatInputOptions);

    const options = {
      person: true,
      signupButton,
      rememberAllButton,
      emailInput,
      loginInput,
      nameInput,
      surnameInput,
      phoneInput,
      passwordInput,
      passwordRepeatInput,
      submitFormHandler: (event: Event) => this._enter(event),
    };

    super(options, rootId);
  }

  private async _enter(event: Event): Promise<void> {
    event.preventDefault();
    const form = document.forms.namedItem('signup');

    if (form) {
      const data = getFormData(form);
      const formInputs = [
        (<ISignupPageOptions> this.props).loginInput,
        (<ISignupPageOptions> this.props).emailInput,
        (<ISignupPageOptions> this.props).nameInput,
        (<ISignupPageOptions> this.props).surnameInput,
        (<ISignupPageOptions> this.props).phoneInput,
        (<ISignupPageOptions> this.props).passwordInput,
        (<ISignupPageOptions> this.props).passwordRepeatInput
      ];

      if (formInputs.reduce((acc, input) => input.validate() && acc, true)
      ) {
        try {
          delete data.passwordRepeatInput;
          await new AuthApi().signup(data);
          Router.go(redirections.CHATS);
        } catch (err) {
          console.error(`${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
        }
      }
    }
  }

  private _redirect(): void {
    Router.go(redirections.LOGOUT);
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
    const template = Handlebars.compile(signup);
    const {
      elementId,
      signupButton,
      rememberAllButton,
      emailInput,
      loginInput,
      nameInput,
      surnameInput,
      phoneInput,
      passwordInput,
      passwordRepeatInput
    } = this.props as ISignupPageOptions;

    return template({
      elementId: elementId,
      signupButton: signupButton.render(),
      rememberAllButton: rememberAllButton.render(),
      emailInput: emailInput.render(),
      loginInput: loginInput.render(),
      nameInput: nameInput.render(),
      surnameInput: surnameInput.render(),
      phoneInput: phoneInput.render(),
      passwordInput: passwordInput.render(),
      passwordRepeatInput: passwordRepeatInput.render(),
      titles,
    });
  }
}

export default Signup;
