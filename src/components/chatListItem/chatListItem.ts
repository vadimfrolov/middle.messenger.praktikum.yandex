import Handlebars from 'handlebars';

import errors from '../../constants/errors';
import redirections from '../../constants/redirections';
import { IAvatarOptions, IChatListItemOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { ActionTypes, GlobalStore } from '../../utils/store';
import ChatsApi from '../../api/chatsApi';
import Avatar from '../avatar/avatar';
import Block from '../block/block';
import chatListItem from './chatListItem.html';
import './chatListItem.less';

class ChatListItem extends Block {
  constructor(options: IChatListItemOptions, rootId?: string) {
    options.className = GlobalStore.get('selectedChatId') === options.id ? ' chat-list-item-selected' : '';

    const profileAvatarOptions: IAvatarOptions = {
      avatarSrc: options.avatar ?? '',
      isNoUpload: true,
    };
    const profileAvatar = new Avatar(profileAvatarOptions);

    options.profileAvatar = profileAvatar;
    options.events = { click: async () => {
      if (GlobalStore.get('selectedChatId') !== options.id) {
        try {
          const chatInfoToken = await new ChatsApi().getCurrentChatToken(options.id);
          GlobalStore.dispatchAction(ActionTypes.SELECTED_CHAT_ID, (<IChatListItemOptions> this.props).id);
          GlobalStore.dispatchAction(ActionTypes.SELECTED_CHAT_TOKEN, JSON.parse(<string>chatInfoToken).token);
          this._redirect();
        } catch (err) {
          console.error(`${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
        }
      }
    }};

    super(options, rootId);
  }

  private _redirect(): void {
    Router.go(redirections.CHAT);
  }

  setClassName() {
    if (GlobalStore.get('selectedChatId') === (<IChatListItemOptions> this.props).id) {
      this.setProps(<IChatListItemOptions>{ className: ' chat-list-item-selected' });
    }
  }

  componentDidMount() {
    GlobalStore.subscribe(ActionTypes.SELECTED_CHAT_ID, this.setClassName.bind(this));
  }

  render(): string {
    const template = Handlebars.compile(chatListItem);
    const { profileAvatar } = this.props as IChatListItemOptions;

    return template({
      ...this.props,
      profileAvatar: profileAvatar!.render()
    });
  }
}

export default ChatListItem;
