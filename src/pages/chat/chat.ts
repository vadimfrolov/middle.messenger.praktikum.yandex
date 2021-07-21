import inputNames from '../../constants/inputNames';
import errors from '../../constants/errors';
import titles from '../../constants/titles';
import urls from '../../constants/urls';
import { getChats } from '../../services/chatServices';
import { ActionTypes, GlobalStore } from '../../utils/store';
import { IAvatarOptions, IButtonOptions, IChatListItemOptions, IChatPageOptions, IInputOptions, IModalOptions } from '../../utils/interfaces';
import { isNotEmpty } from '../../utils/validations';
import { showAlert } from '../../utils/utils';
import redirections from '../../constants/redirections';
import Router from '../../utils/router';
import AuthApi from '../../api/authApi';
import ChatsAPI from '../../api/chatsApi';
import Avatar from '../../components/avatar/avatar';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import ChatList from '../../components/chatList/chatList';
import ChatWebSocket from '../../utils/webSocket';
import Input from '../../components/input/input';
import Modal from '../../components/modal/modal';
import chat from './chat.html';
import './chat.less';

class Chat extends Block {
  constructor(rootId: string) {
    const chatList: unknown = GlobalStore.get('chatList');
    const selectedChatId: string = <string>GlobalStore.get('selectedChatId');
    const selectedChat = (<Record<string, unknown>[]>chatList)?.find((chat: Record<string, unknown>) => chat.id === selectedChatId);
    const avatarSrc = selectedChat?.avatar;

    const profileAvatarOptions: IAvatarOptions = {
      avatarSrc: <string>avatarSrc,
      avatarClass: 'chat-header-avatar',
      uploadAvatar: async (event: Event): Promise<void> => {
        const formData = new FormData();

        formData.append('chatId', selectedChatId);
        formData.append('avatar', (<HTMLInputElement>event.target)!.files![0]);

        try {
          const response = (await new ChatsAPI().uploadAvatar(formData));
          if (response) {
            const newAvatar = JSON.parse(<string>response).avatar;
            newAvatar && (<IChatListItemOptions> this.props)!.profileAvatar!.setProps(<IAvatarOptions>{ avatarSrc: `${urls.AVATAR}${newAvatar}` });
            const parsedChats = await getChats();
            GlobalStore.dispatchAction(ActionTypes.CHAT_LIST, parsedChats);
          }
        } catch (err) {
          (<IChatPageOptions> this.props).profileAvatar.setProps(<IAvatarOptions>{ erroravatarError: err });
        }
      }
    };

    const chatInputOptions: IInputOptions = {
      inputClass: 'input-long',
      inputPlaceholder: titles.MESSAGE,
      error: 'no',
      validateFunctions: [],
      events: {
        change: (event: Event): void => {
          (<IChatPageOptions> this.props).chatInput.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value });
        },
        keydown: (event: KeyboardEvent): void => {
          if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            (<IChatPageOptions> this.props).chatInput.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value });
            (<HTMLElement>document.querySelector('#send-message-button'))!.click();
          }
        }
      }
    };

    const chatNameButtonOptions: IButtonOptions = {
      buttonText: <string>selectedChat?.title,
      buttonClass: 'button-link button-font-primary button-bold button-link-without-decoration chat-header-name',
      events: { click: () => {
        console.log('ho-ho-ho, swagger does not provide url for renaming title');
        const chatNameModal = document.querySelector('#rename-chat');
        chatNameModal?.classList.add('modal-open');
      }}
    };

    const submitButtonOptions: IButtonOptions = {
      buttonImg: '/assets/submit.svg',
      buttonClass: 'button-round',
      elementId: 'send-message-button',
      events: {
        click: () => {
          this.sendChatMessage((<IInputOptions>(<IChatPageOptions> this.props).chatInput.props).info ?? '');
          (<IChatPageOptions> this.props).chatInput.setProps(<IInputOptions>{ info: ''});
        },
      }
    };

    const modalInputRenameChatOptions: IInputOptions = {
      label: titles.CHAT,
      inputPlaceholder: titles.CHAT_PLACEHOLDER,
      name: inputNames.CHAT_NAME,
      inputId: 'rename-chat-input',
      validateFunctions: [isNotEmpty],
      events: { change: (event: Event) => ((<IModalOptions>(<IChatPageOptions> this.props).modalWindowRenameChat.props).modalInput)?.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value }) }
    };

    const modalButtonRenameChatOptions: IButtonOptions = {
      buttonText: titles.RENAME,
      events: { click: () => {
        const renameChatInput = document.querySelector('#rename-chat-input');
        if (renameChatInput && (<Input>(<IModalOptions>(<IChatPageOptions> this.props).modalWindowRenameChat.props).modalInput).validate()) {
          const renameChatModal = document.querySelector('#rename-chat');
          renameChatModal?.classList.remove('modal-open');
        }
      }}
    };

    const modalInputRenameChat = new Input(modalInputRenameChatOptions);
    const modalButtonRenameChat = new Button(modalButtonRenameChatOptions);

    const modalWindowRenameChatOptions: IModalOptions = {
      modalTitle: titles.RENAME_CHAT,
      modalInput: modalInputRenameChat,
      modalButton: modalButtonRenameChat,
      elementId: 'rename-chat',
    };

    const profileAvatar = new Avatar(profileAvatarOptions);
    const chatInput = new Input(chatInputOptions);
    const submitButton = new Button(submitButtonOptions);
    const chatNameButton = new Button(chatNameButtonOptions);
    const modalWindowRenameChat = new Modal(modalWindowRenameChatOptions);
    const chatListComponent = new ChatList();

    const options = {
      person: true,
      profileAvatar,
      chatInput,
      submitButton,
      chatNameButton,
      modalWindowRenameChat,
      chatListComponent,
    };

    super(options, rootId);
  }

  async componentDidMount() {
    try {
      const userInfo = await new AuthApi().getUserInfo();
      GlobalStore.dispatchAction(ActionTypes.CURRENT_USER, JSON.parse(<string>userInfo));

      if (GlobalStore.get('selectedChatId') && GlobalStore.get('selectedChatToken')) {
        this.connectToChat();
      }

      GlobalStore.subscribe(ActionTypes.CHAT_MESSAGES, this.onChatMessage.bind(this));
    } catch (err) {
      showAlert('alert-error', `${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
    }
  }

  afterRender(): void {
    const closeMenu = () => {
      const settings = document.querySelector('.chat-footer-menu');
      settings?.classList.remove('chat-footer-menu-open');
    };

    document.addEventListener('click', closeMenu);

    const onAttachClickHandler = (event: Event) => {
      event.stopPropagation();
      const attach = document.querySelector('.chat-footer-menu');
      attach?.classList.toggle('chat-footer-menu-open');
    };

    const attachElement = document.querySelector('.chat-footer-attach');
    attachElement?.addEventListener('click', onAttachClickHandler);

    const settings = document.querySelector('.chat-footer-menu');
    settings?.addEventListener('click', event => event.stopPropagation());

    if (!GlobalStore.get('selectedChatId')) {
      Router.go(redirections.CHATS);
    }

    const el = document.querySelector('.chat-feed');
    el!.scrollTop = el!.scrollHeight;
  }

  render(): string {
    const {
      elementId,
      profileAvatar,
      chatInput,
      submitButton,
      chatNameButton,
      modalWindowRenameChat,
      chatListComponent,
      chatMessages
    } = this.props as IChatPageOptions;

    return chat({
      elementId: elementId,
      profileAvatar: profileAvatar.render(),
      chatInput: chatInput.render(),
      submitButton: submitButton.render(),
      chatNameButton: chatNameButton.render(),
      modalWindowRenameChat: modalWindowRenameChat.render(),
      chatListComponent: chatListComponent.render(),
      chatMessages: chatMessages,
      attachImg: '/assets/paperclip.svg',
      submitImg: '/assets/submit.svg',
      photoImg: '/assets/photoMenuIcon.svg',
      fileImg: '/assets/fileMenuIcon.svg',
      locationImg: '/assets/locationMenuIcon.svg',
      titles,
    });
  }

  private connectToChat() {
    new ChatWebSocket(
      (<Record<string, string>>GlobalStore.get('currentUser')).id,
      <number>GlobalStore.get('selectedChatId'),
      <string>GlobalStore.get('selectedChatToken'),
    );
  }

  private sendChatMessage(message: string) {
    if (message === '') {
      return
    }

    (new ChatWebSocket()).send({
      content: message,
      type: 'message',
    });
  }

  private async onChatMessage(state: Record<string, unknown>) {
    const id = GlobalStore.get('selectedChatId');
    try {
      const count = await new ChatsAPI().getUnreadMessagesByChatId(<number>id);
      let chats = GlobalStore.get('chatList');
      const changeData = (data: Record<string, unknown>) => {
        if (data.id === id) {
          data.unread_count = JSON.parse(<string>count).unread_count;
        }

        return data;
      };

      if (Array.isArray(chats)) {
        chats = chats.map(chat => changeData(chat));
      } else if (typeof chats === 'object') {
        chats = changeData(chats);
      }

      GlobalStore.dispatchAction(ActionTypes.CHAT_LIST, chats);
    } catch (err) {
      console.log('can not get unread messages');
    }

    this.setProps(<IChatPageOptions>{ chatMessages: state.chatMessages });
  }
}

export default Chat;
