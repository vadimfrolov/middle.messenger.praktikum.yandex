import urls from '../../constants/urls';
import { IAvatarOptions, IInputOptions } from '../../utils/interfaces';
import Block from '../block/block';
import Input from '../input/input';
import avatar from './avatar.html';
import './avatar.less';

const DEFAULT_AVATAR = '/assets/avatar.svg';

class Avatar extends Block {
  constructor(options: IAvatarOptions, rootId?: string) {
    const avatarInputOptions: IInputOptions = {
      inputType: 'file',
      inputClass: 'avatar-input',
      name: 'avatarInput',
      inputId: 'upload-photo',
      validateFunctions: [],
    };
    if (!options.isNoUpload) {
      avatarInputOptions.events = {
        change: (event: Event) => { options?.uploadAvatar && options.uploadAvatar(event); }
      };
    }
    options.avatarInput = new Input(avatarInputOptions);

    const defineAvatarClasses = () => {
      let avatarClassName = options.avatarClass ? ` ${options.avatarClass}` : '';
      avatarClassName += options.isNoUpload ? ' avatar-no-upload' : '';

      return avatarClassName;
    };

    options.avatarClass = defineAvatarClasses();
    options.avatarSrc = options.avatarSrc ? `${urls.AVATAR}${options.avatarSrc}` : DEFAULT_AVATAR;

    super(options, rootId);
  }

  render(): string {
    const { avatarSrc, avatarInput } = this.props as IAvatarOptions;

    return avatar({
      ...this.props,
      avatarSrc: avatarSrc ?? DEFAULT_AVATAR,
      isEmpty: avatarSrc === DEFAULT_AVATAR || !avatarSrc,
      avatarInput: avatarInput?.render(),
    });
  }
}

export default Avatar;
