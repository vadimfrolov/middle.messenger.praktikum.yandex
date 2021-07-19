import errors from '../../constants/errors';
import urls from '../../constants/urls';
import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import { ActionTypes, GlobalStore } from '../../utils/store';
import { showAlert } from '../../utils/utils';
import { IAvatarOptions, IButtonOptions, IProfilePageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import AuthApi from '../../api/authApi';
import UserApi from '../../api/userApi';
import Aside from '../../components/aside/aside';
import Avatar from '../../components/avatar/avatar';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import profile from './profile.html';
import './profile.less';

class Profile extends Block {
  constructor(rootId: string) {
    const profileInfo = GlobalStore.get('profileInfo') ?? {};

    // avatar
    const profileAvatarOptions: IAvatarOptions = {
      avatarSrc: (<Record<string, string>> profileInfo)?.avatar,
      avatarClass: 'avatar-big',
      uploadAvatar: async (event: Event): Promise<void> => {
        const formData = new FormData();
        formData.append('avatar', (<HTMLInputElement>event.target)!.files![0]);

        try {
          const response = await new UserApi().changeProfileAvatar(formData);
          if (response) {
            const newAvatar = JSON.parse(<string>response).avatar;
            newAvatar && (<IProfilePageOptions> this.props).profileAvatar.setProps(<IAvatarOptions>{ avatarSrc: `${urls.AVATAR}${newAvatar}` });
            (<IProfilePageOptions> this.props).profileAvatar.setProps(<IAvatarOptions>{ avatarError: '' });
          }
        } catch (err) {
          (<IProfilePageOptions> this.props).profileAvatar.setProps(<IAvatarOptions>{ avatarError: 'Выберите другой файл' });
        }
      }
    };

    // buttons
    const changeInfoButtonOptions: IButtonOptions = {
      buttonText: titles.CHANGE_INFO,
      buttonClass: 'button-link',
      events: { click: (event: Event) => this._redirect(event) },
      elementId: 'profile-edit-button',
    };

    const changePasswordButtonOptions: IButtonOptions = {
      buttonText: titles.CHANGE_PASSWORD,
      buttonClass: 'button-link',
      events: { click: (event: Event) => this._redirect(event) },
      elementId: 'change-password-button',
    };

    const logoutButtonOptions: IButtonOptions = {
      buttonText: titles.LOGOUT,
      buttonClass: 'button-link button-logout',
      events: { click: () => this._logout() },
      elementId: 'logout-button',
    };

    const aside = new Aside();
    const profileAvatar = new Avatar(profileAvatarOptions);

    const changeInfoButton = new Button(changeInfoButtonOptions);
    const changePasswordButton = new Button(changePasswordButtonOptions);
    const logoutButton = new Button(logoutButtonOptions);

    const options = {
      person: true,
      aside,
      profileAvatar,
      changeInfoButton,
      changePasswordButton,
      logoutButton,
    };

    super(options, rootId);
  }

  async componentDidMount() {
    GlobalStore.subscribe(ActionTypes.CURRENT_USER, this.onProfileInfo.bind(this));
    if (!(<IProfilePageOptions> this.props).profileInfo) {
      try {
        const profileInfo = await new AuthApi().getUserInfo();
        GlobalStore.dispatchAction(ActionTypes.CURRENT_USER, JSON.parse(<string>profileInfo));
      } catch (err) {
        showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
      }
    }
  }

  private async _logout(): Promise<void> {
    try {
      await new AuthApi().logout();
      GlobalStore.dispatchAction(ActionTypes.LOGOUT);
      Router.go(redirections.LOGOUT);
    } catch (err) {
      showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
    }
  }

  private _redirect(event: Event): void {
    const buttonId = (<HTMLButtonElement>event.target).id;
    const buttonHref = buttonId?.toUpperCase().slice(0, buttonId?.length - 7)
      .replace('-', '_');
    Router.go(redirections[buttonHref]);
  }

  private onProfileInfo(state: Record<string, Record<string, string>>) {
    this.setProps(<IProfilePageOptions>{ profileInfo: state.currentUser });
    (<IProfilePageOptions> this.props).profileAvatar.setProps(<IAvatarOptions>{ avatarSrc: state.currentUser?.avatar ? `${urls.AVATAR}${state.currentUser.avatar}` : null });
  }

  render(): string {
    const {
      elementId,
      aside,
      profileAvatar,
      changeInfoButton,
      changePasswordButton,
      logoutButton,
    } = this.props as IProfilePageOptions;

    return profile({
      elementId: elementId,
      aside: aside.render(),
      profileAvatar: profileAvatar.render(),
      changeInfoButton: changeInfoButton.render(),
      changePasswordButton: changePasswordButton.render(),
      logoutButton: logoutButton.render(),
      profileInfo: GlobalStore.get('currentUser'),
      titles,
    });
  }
}

export default Profile;
