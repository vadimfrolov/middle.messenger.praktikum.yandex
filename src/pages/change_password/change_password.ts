import errors from '../../constants/errors';
import inputNames from '../../constants/inputNames';
import messages from '../../constants/messages';
import titles from '../../constants/titles';
import redirections from '../../constants/redirections';
import urls from '../../constants/urls';
import { ActionTypes, GlobalStore } from '../../utils/store';
import { IAvatarOptions, IButtonOptions, IChangePasswordPageOptions, IInputOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { getFormData, getName, showAlert } from '../../utils/utils';
import { isPassword, isPasswordSame } from '../../utils/validations';
import AuthApi from '../../api/authApi';
import UserApi from '../../api/userApi';
import Aside from '../../components/aside/aside';
import Avatar from '../../components/avatar/avatar';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import changePassword from './change_password.html';
import './change_password.less';

class ChangePassword extends Block {
  constructor(rootId: string) {
    const profileInfo = GlobalStore.get('profileInfo');

    const profileAvatarOptions: IAvatarOptions = {
      avatarSrc: (<Record<string, string>> profileInfo)?.avatar,
      avatarClass: 'avatar-big avatar-disabled',
    };

    const saveButtonOptions: IButtonOptions = {
      buttonText: titles.SAVE,
      buttonType: 'submit',
    };

    const oldPasswordInputOptions: IInputOptions = {
      label: titles.OLD_PASSWORD,
      inputPlaceholder: titles.OLD_PASSWORD_PLACEHOLDER,
      inputType: inputNames.PASSWORD,
      name: inputNames.OLD_PASSWORD,
      validateFunctions: [isPassword],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const newPasswordInputOptions: IInputOptions = {
      label: titles.NEW_PASSWORD,
      inputPlaceholder: titles.PASSWORD_PLACEHOLDER,
      inputType: inputNames.PASSWORD,
      name: inputNames.NEW_PASSWORD,
      validateFunctions: [isPassword],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const newPasswordRepeatInputOptions: IInputOptions = {
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

    const aside = new Aside();
    const profileAvatar = new Avatar(profileAvatarOptions);
    const saveButton = new Button(saveButtonOptions);

    const oldPasswordInput = new Input(oldPasswordInputOptions);
    const passwordInput = new Input(newPasswordInputOptions);
    const passwordRepeatInput = new Input(newPasswordRepeatInputOptions);

    const options = {
      person: true,
      aside,
      profileAvatar,
      saveButton,
      oldPasswordInput,
      passwordInput,
      passwordRepeatInput,
      submitFormHandler: (event: Event) => this._enter(event),
    };

    super(options, rootId);
  }

  private async _enter(event: Event): Promise<void> {
    event.preventDefault();
    const form = document.forms.namedItem('changePassword');

    if (form) {
      const data = getFormData(form);
      const formInputs = [
        (<IChangePasswordPageOptions> this.props).oldPasswordInput,
        (<IChangePasswordPageOptions> this.props).passwordInput,
        (<IChangePasswordPageOptions> this.props).passwordRepeatInput,
      ];

      if (formInputs.reduce((acc, input) => input.validate() && acc, true)) {
        try {
          delete data.passwordRepeatInput;
          await new UserApi().changePassword(data);
          Router.go(redirections.PROFILE);
          showAlert('alert-success', messages.PASSWORD_CHANGED);
        } catch (err) {
          showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
        }
      }
    }
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

  async componentDidMount() {
    GlobalStore.subscribe(ActionTypes.CURRENT_USER, this.onAvatarInfo.bind(this));
    try {
      const profileInfo = await new AuthApi().getUserInfo();
      GlobalStore.dispatchAction(ActionTypes.CURRENT_USER, JSON.parse(<string>profileInfo));
    } catch (err) {
      showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
    }
  }

  private onAvatarInfo(state: Record<string, Record<string, string>>) {
    (<IChangePasswordPageOptions> this.props).profileAvatar.setProps(<IAvatarOptions>{ avatarSrc: `${urls.AVATAR}${state.currentUser.avatar}` });
  }

  render(): string {
    const {
      elementId,
      aside,
      profileAvatar,
      saveButton,
      oldPasswordInput,
      passwordInput,
      passwordRepeatInput
    } = this.props as IChangePasswordPageOptions;

    return changePassword({
      elementId: elementId,
      aside: aside.render(),
      profileAvatar: profileAvatar.render(),
      saveButton: saveButton.render(),
      oldPasswordInput: oldPasswordInput.render(),
      passwordInput: passwordInput.render(),
      passwordRepeatInput: passwordRepeatInput.render(),
    });
  }
}

export default ChangePassword;
