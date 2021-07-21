import urls from '../../constants/urls';
import errors from '../../constants/errors';
import inputNames from '../../constants/inputNames';
import messages from '../../constants/messages';
import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import { ActionTypes, GlobalStore } from '../../utils/store';
import { IAvatarOptions, IButtonOptions, IInputOptions, IProfileEditPageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { getFormData, getName, showAlert } from '../../utils/utils';
import { isEmail, isNotEmpty, isPhone } from '../../utils/validations';
import AuthApi from '../../api/authApi';
import UserApi from '../../api/userApi';
import Aside from '../../components/aside/aside';
import Avatar from '../../components/avatar/avatar';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import profileEdit from './profile_edit.html';
import './profile_edit.less';

class ProfileEdit extends Block {
  constructor(rootId: string) {
    const profileInfo = GlobalStore.get('profileInfo');

    // avatar
    const profileAvatarOptions: IAvatarOptions = {
      avatarSrc: (<Record<string, string>> profileInfo)?.avatar,
      avatarClass: 'avatar-big avatar-disabled',
    };

    // button
    const saveButtonOptions: IButtonOptions = {
      buttonText: titles.SAVE,
      buttonType: 'submit',
    };

    // inputs
    const emailInputOptions: IInputOptions = {
      label: titles.EMAIL,
      inputPlaceholder: titles.EMAIL_PLACEHOLDER,
      info: (<Record<string, string>> profileInfo)?.email,
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
      info: (<Record<string, string>> profileInfo)?.login,
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
      info: (<Record<string, string>> profileInfo)?.first_name,
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
      info: (<Record<string, string>> profileInfo)?.second_name,
      name: inputNames.SURNAME,
      validateFunctions: [isNotEmpty],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const chatNameInputOptions: IInputOptions = {
      label: titles.CHAT_NAME,
      inputPlaceholder: titles.CHAT_NAME_PLACEHOLDER,
      info: (<Record<string, string>> profileInfo)?.display_name,
      name: inputNames.CHAT_NAME,
      validateFunctions: [isNotEmpty],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const phoneInputOptions: IInputOptions = {
      label: titles.PHONE,
      inputPlaceholder: titles.PHONE_PLACEHOLDER,
      info: (<Record<string, string>> profileInfo)?.phone,
      name: inputNames.PHONE,
      validateFunctions: [isPhone],
      events: {
        change: (event: Event) => this._onChange(event),
        keydown: (event: KeyboardEvent) => this._onKeyDown(event),
      }
    };

    const aside = new Aside();
    const profileAvatar = new Avatar(profileAvatarOptions);
    const saveButton = new Button(saveButtonOptions);

    const emailInput = new Input(emailInputOptions);
    const loginInput = new Input(loginInputOptions);
    const nameInput = new Input(nameInputOptions);
    const surnameInput = new Input(surnameInputOptions);
    const chatNameInput = new Input(chatNameInputOptions);
    const phoneInput = new Input(phoneInputOptions);

    const options = {
      person: true,
      aside,
      profileAvatar,
      saveButton,
      emailInput,
      loginInput,
      nameInput,
      surnameInput,
      chatNameInput,
      phoneInput,
      submitFormHandler: (event: Event) => this._enter(event),
    };

    super(options, rootId);
  }

  private async _enter(event: Event): Promise<void> {
    event.preventDefault();
    const form = document.forms.namedItem('personInfo');

    if (form) {
      const data = getFormData(form);
      const formInputs = [
        (<IProfileEditPageOptions> this.props).loginInput,
        (<IProfileEditPageOptions> this.props).emailInput,
        (<IProfileEditPageOptions> this.props).nameInput,
        (<IProfileEditPageOptions> this.props).surnameInput,
        (<IProfileEditPageOptions> this.props).chatNameInput,
        (<IProfileEditPageOptions> this.props).phoneInput
      ];

      if (formInputs.reduce((acc, input) => input.validate() && acc, true)) {
        try {
          await new UserApi().changeProfile(data);
          Router.go(redirections.PROFILE);
          showAlert('alert-success', messages.PROFILE_CHANGED);
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
    GlobalStore.subscribe(ActionTypes.CURRENT_USER, this.onProfileInfo.bind(this));
    try {
      const profileInfo = await new AuthApi().getUserInfo();
      GlobalStore.dispatchAction(ActionTypes.CURRENT_USER, JSON.parse(<string>profileInfo));
    } catch (err) {
      showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
    }
  }

  private onProfileInfo(state: Record<string, Record<string, string>>) {
    const {
      profileAvatar,
      emailInput,
      loginInput,
      nameInput,
      surnameInput,
      chatNameInput,
      phoneInput
    } = this.props as IProfileEditPageOptions;

    profileAvatar.setProps(<IAvatarOptions>{ avatarSrc: `${urls.AVATAR}${state.currentUser.avatar}` });
    emailInput.setProps(<IInputOptions>{ info: state.currentUser.email });
    loginInput.setProps(<IInputOptions>{ info: state.currentUser.login });
    nameInput.setProps(<IInputOptions>{ info: state.currentUser.first_name });
    surnameInput.setProps(<IInputOptions>{ info: state.currentUser.second_name });
    chatNameInput.setProps(<IInputOptions>{ info: state.currentUser.display_name });
    phoneInput.setProps(<IInputOptions>{ info: state.currentUser.phone });
  }

  render(): string {
    const {
      elementId,
      aside,
      profileAvatar,
      saveButton,
      emailInput,
      loginInput,
      nameInput,
      surnameInput,
      chatNameInput,
      phoneInput
    } = this.props as IProfileEditPageOptions;

    return profileEdit({
      elementId: elementId,
      aside: aside.render(),
      profileAvatar: profileAvatar.render(),
      saveButton: saveButton.render(),
      emailInput: emailInput.render(),
      loginInput: loginInput.render(),
      nameInput: nameInput.render(),
      surnameInput: surnameInput.render(),
      chatNameInput: chatNameInput.render(),
      phoneInput: phoneInput.render(),
    });
  }
}

export default ProfileEdit;
