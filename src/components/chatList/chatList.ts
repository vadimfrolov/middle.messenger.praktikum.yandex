import Handlebars from 'handlebars';

import inputNames from '../../constants/inputNames';
import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import { GlobalStore, ActionTypes } from '../../utils/store';
import { IButtonOptions, IChatListItemOptions, IChatListOptions, IInputOptions, IModalOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import { isNotEmpty } from '../../utils/validations';
import { getChats } from '../../services/chatServices';
import { getUsers } from '../../services/userServices';
import ChatsApi from '../../api/chatsApi';
import Block from '../block/block';
import Button from '../button/button';
import ChatListItem from '../chatListItem/chatListItem';
import Input from '../input/input';
import Modal from '../modal/modal';
import chatList from './chatList.html';
import './chatList.less';

const closeSettings = () => {
  const settings = document.querySelector('.chats-menu-settings');
  settings?.classList.remove('chats-menu-settings-open');
};

document.addEventListener('click', closeSettings);

class ChatList extends Block {
  constructor(rootId?: string) {

    // buttons
    const settingsButtonOptions: IButtonOptions = {
      buttonText: titles.SETTINGS_SIGN,
      buttonClass: 'button-link button-link-without-decoration button-font-primary button-bold',
      events: {click: (event: Event) => {
        event.stopPropagation();
        const profileSetting = document.querySelector('.chats-menu-settings');
        profileSetting?.classList.toggle('chats-menu-settings-open');
      }}
    };

    const createChatButtonOptions: IButtonOptions = {
      buttonText: titles.CREATE_CHAT,
      buttonClass: 'button-alignment-left button-width-content button-font-primary button-bold',
      events: { click: () => {
        const createChatModal = document.querySelector('#create-chat');
        createChatModal?.classList.add('modal-open');
      }}
    };

    const profileButtonOptions: IButtonOptions = {
      buttonText: titles.PROFILE,
      buttonClass: 'button-link button-font-primary',
      events: { click: () => Router.go(redirections.PROFILE) }
    };

    const addUserButtonOptions: IButtonOptions = {
      buttonText: titles.ADD_USER,
      buttonClass: 'button-link button-font-primary',
      events: { click: () => {
        const addUserModal = document.querySelector('#add-user');
        addUserModal?.classList.add('modal-open');
      }}
    };

    const deleteUserButtonOptions: IButtonOptions = {
      buttonText: titles.DELETE_USER,
      buttonClass: 'button-link button-font-primary',
      events: { click: () => {
        const deleteUserModal = document.querySelector('#delete-user');
        deleteUserModal?.classList.add('modal-open');
      }}
    };

    const deleteChatButtonOptions: IButtonOptions = {
      buttonText: titles.DELETE_CHAT,
      buttonClass: 'button-link button-font-primary button-logout',
      events: { click: () => {
        const deleteChatModal = document.querySelector('#delete-chat');
        deleteChatModal?.classList.add('modal-open');
      }}
    };

    // inputs
    const searchInputOptions: IInputOptions = {
      inputPlaceholder: titles.CHAT_SEARCH_PLACEHOLDER,
      name: inputNames.SEARCH,
      inputClass: 'input-long',
      validateFunctions: [],
      events: { keydown: async (event: KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          try {
            const title = (<HTMLInputElement>event.target).value || '';
            (<IChatListOptions> this.props).chatSearchInput?.setProps(<IInputOptions>{ info: title });
            const parsedChats = await getChats(title);
            GlobalStore.dispatchAction(ActionTypes.CHAT_LIST, parsedChats);
          } catch (err) {
            console.error(err);
          }
        }
      }}
    };

    // modal inputs
    const modalInputAddUserOptions: IInputOptions = {
      label: titles.LOGIN,
      inputPlaceholder: titles.LOGIN_PLACEHOLDER,
      name: inputNames.USER,
      inputId: 'add-user-input',
      validateFunctions: [isNotEmpty],
      events: { change: (event: Event) => (<IModalOptions>(<IChatListOptions> this.props).modalWindowAddUser.props).modalInput?.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value })}
    };

    const modalInputDeleteUserOptions: IInputOptions = {
      label: titles.LOGIN,
      inputPlaceholder: titles.LOGIN_PLACEHOLDER,
      name: inputNames.USER,
      inputId: 'delete-user-input',
      validateFunctions: [isNotEmpty],
      events: { change: (event: Event) => (<IModalOptions>(<IChatListOptions> this.props).modalWindowDeleteUser.props).modalInput?.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value })}
    };

    const modalInputCreateChatOptions: IInputOptions = {
      label: titles.CHAT,
      inputPlaceholder: titles.CHAT_PLACEHOLDER,
      name: inputNames.CHAT_NAME,
      inputId: 'create-chat-input',
      validateFunctions: [isNotEmpty],
      events: { change: (event: Event) => (<IModalOptions>(<IChatListOptions> this.props).modalWindowCreateChat.props).modalInput?.setProps(<IInputOptions>{ info: (<HTMLInputElement>event.target).value })}
    };

    // modal buttons
    const modalButtonAddUserOptions: IButtonOptions = {
      buttonText: titles.ADD_USER,
      events: { click: async () => {
        const addUserInput = document.querySelector('#add-user-input');
        if (addUserInput) {
          try {
            const title = <Input>(<IModalOptions>(<IChatListOptions> this.props).modalWindowAddUser.props).modalInput;
            if (title?.validate()) {
              const selectedChatId = GlobalStore.get('selectedChatId');
              const newUsers = (<IInputOptions>title.props).info?.split(', ');
              const finalUsersIds = await getUsers(<string>selectedChatId, <string[]>newUsers, true);

              if (finalUsersIds.length) {
                await new ChatsApi().addUsersToChat({ users: finalUsersIds, chatId: <string>selectedChatId});
                if (finalUsersIds!.length !== newUsers!.length) {
                  console.error('some users are already in this chat');
                }
              } else {
                console.error('no new users for adding');
              }
            }
          } catch (err) {
            console.error(err);
          } finally {
            const addUserModal = document.querySelector('#add-user');
            addUserModal?.classList.remove('modal-open');
            (<IModalOptions>(<IChatListOptions> this.props).modalWindowAddUser.props).modalInput?.setProps(<IInputOptions>{ info: '' });
            (<IModalOptions>(<IChatListOptions> this.props).modalWindowAddUser.props).modalInput?.setProps(<IInputOptions>{ errorMessage: '' });
          }
        }
      }}
    };

    const modalButtonDeleteUserOptions: IButtonOptions = {
      buttonText: titles.DELETE_USER,
      events: { click: async () => {
        const deleteUserInput = document.querySelector('#delete-user-input');
        if (deleteUserInput) {
          // TODO: add to service
          try {
            const title = (<Input>(<IModalOptions>(<IChatListOptions> this.props).modalWindowDeleteUser.props).modalInput);
            if (title.validate()) {
              const selectedChatId = GlobalStore.get('selectedChatId');
              const usersToDelete = (<IInputOptions>title.props).info?.split(', ');
              const finalUsersIds = await getUsers(<string>selectedChatId, <string[]>usersToDelete);

              if (finalUsersIds.length) {
                await new ChatsApi().removeUsersFromChat({ users: finalUsersIds, chatId: <string>selectedChatId});
                if (finalUsersIds!.length !== usersToDelete!.length) {
                  console.error('some users are not from this chat');
                }
              } else {
                console.error('no users for deleting');
              }
            }
          } catch (err) {
            console.error(err);
          } finally {
            const addUserModal = document.querySelector('#delete-user');
            addUserModal?.classList.remove('modal-open');
            (<IModalOptions>(<IChatListOptions> this.props).modalWindowDeleteUser.props).modalInput?.setProps(<IInputOptions>{ info: '' });
            (<IModalOptions>(<IChatListOptions> this.props).modalWindowDeleteUser.props).modalInput?.setProps(<IInputOptions>{ errorMessage: '' });
          }
        }
      }
      }
    };

    const modalButtonDeleteChatOptions: IButtonOptions = {
      buttonText: titles.YES,
      buttonClass: 'button-link',
      events: { click: async () => {
        try {
          const selectedChatId = GlobalStore.get('selectedChatId');
          await new ChatsApi().deleteChat(<Record<string, string>>{ chatId: selectedChatId });
          const parsedChats = await getChats();
          GlobalStore.dispatchAction(ActionTypes.CHAT_LIST, parsedChats);
        } catch (err) {
          console.error(err);
        } finally {
          const deleteChatModal = document.querySelector('#delete-chat');
          deleteChatModal?.classList.remove('modal-open');
        }
      }}
    };

    const modalButtonDeleteChatCancelOptions: IButtonOptions = {
      buttonText: titles.NO,
      buttonClass: 'button-link button-logout',
      events: { click: () => {
        const deleteChatModal = document.querySelector('#delete-chat');
        deleteChatModal?.classList.remove('modal-open');
      }}
    };

    const modalButtonCreateChatOptions: IButtonOptions = {
      buttonText: titles.CREATE,
      events: { click: async () => {
        const createChatInput = document.querySelector('#create-chat-input');
        if (createChatInput) {
          try {
            const title = <Input>(<IModalOptions>(<IChatListOptions> this.props).modalWindowCreateChat.props).modalInput;
            if (title?.validate()) {
              await new ChatsApi().createChat({ 'title': (<IInputOptions>title.props).info ?? ''});
              const parsedChats = await getChats();
              GlobalStore.dispatchAction(ActionTypes.CHAT_LIST, parsedChats);
            }
          } catch (err) {
            console.error(err);
          } finally {
            const createChatModal = document.querySelector('#create-chat');
            createChatModal?.classList.remove('modal-open');
          }
        }
      }}
    };

    const modalInputAddUser = new Input(modalInputAddUserOptions);
    const modalButtonAddUser = new Button(modalButtonAddUserOptions);

    const modalInputDeleteUser = new Input(modalInputDeleteUserOptions);
    const modalButtonDeleteUser = new Button(modalButtonDeleteUserOptions);

    const modalButtonDeleteChat = new Button(modalButtonDeleteChatOptions);
    const modalButtonDeleteChatCancel = new Button(modalButtonDeleteChatCancelOptions);

    const modalInputCreateChat = new Input(modalInputCreateChatOptions);
    const modalButtonCreateChat = new Button(modalButtonCreateChatOptions);

    // modals
    const modalWindowAddUserOptions: IModalOptions = {
      modalTitle: titles.ADD_USER,
      modalInput: modalInputAddUser,
      modalButton: modalButtonAddUser,
      elementId: 'add-user',
    };

    const modalWindowDeleteUserOptions: IModalOptions = {
      modalTitle: titles.DELETE_USER,
      modalInput: modalInputDeleteUser,
      modalButton: modalButtonDeleteUser,
      elementId: 'delete-user',
    };

    const modalWindowDeleteChatOptions: IModalOptions = {
      modalTitle: titles.DELETE_CHAT,
      modalText: titles.DELETE_CHAT_CONFIRMATION,
      modalButton: modalButtonDeleteChat,
      modalCancelButton: modalButtonDeleteChatCancel,
      elementId: 'delete-chat',
    };

    const modalWindowCreateChatOptions: IModalOptions = {
      modalTitle: titles.NEW_CHAT,
      modalInput: modalInputCreateChat,
      modalButton: modalButtonCreateChat,
      elementId: 'create-chat',
    };

    const settingsButton = new Button(settingsButtonOptions);
    const createChatButton = new Button(createChatButtonOptions);
    const profileButton = new Button(profileButtonOptions);
    const addUserButton = new Button(addUserButtonOptions);
    const deleteUserButton = new Button(deleteUserButtonOptions);
    const deleteChatButton = new Button(deleteChatButtonOptions);

    const chatSearchInput = new Input(searchInputOptions);
    const modalWindowAddUser = new Modal(modalWindowAddUserOptions);
    const modalWindowDeleteUser = new Modal(modalWindowDeleteUserOptions);
    const modalWindowDeleteChat = new Modal(modalWindowDeleteChatOptions);
    const modalWindowCreateChat = new Modal(modalWindowCreateChatOptions);
    const chatListItems = (<IChatListItemOptions[]>(<unknown>GlobalStore.get('chatList')))?.map((item: IChatListItemOptions) => new ChatListItem(<IChatListItemOptions>item));

    const options = {
      person: true,
      settingsButton,
      createChatButton,
      profileButton,
      addUserButton,
      deleteUserButton,
      deleteChatButton,
      chatSearchInput,
      modalWindowAddUser,
      modalWindowDeleteUser,
      modalWindowDeleteChat,
      modalWindowCreateChat,
      chatListItems,
    };

    super(options, rootId);
  }

  async componentDidMount() {
    GlobalStore.subscribe(ActionTypes.CHAT_LIST, this.chatListCallback.bind(this));

    try {
      const parsedChats = await getChats();
      GlobalStore.dispatchAction(ActionTypes.CHAT_LIST, parsedChats);
    } catch (err) {
      console.error(err);
    }
  }

  chatListCallback(state: Record<string, unknown>) {
    const newChatList = (<IChatListItemOptions[]>state.chatList).map((item: IChatListItemOptions) => new ChatListItem(<IChatListItemOptions>item));
    this.setProps(<IChatListOptions>{ chatListItems: newChatList });
  }

  render(): string {
    const template = Handlebars.compile(chatList);
    const {
      elementId,
      createChatButton,
      profileButton,
      addUserButton,
      deleteUserButton,
      deleteChatButton,
      chatSearchInput,
      settingsButton,
      modalWindowAddUser,
      modalWindowDeleteUser,
      modalWindowDeleteChat,
      modalWindowCreateChat,
      chatListItems
    } = this.props as IChatListOptions;

    return template({
      elementId: elementId,
      createChatButton: createChatButton.render(),
      profileButton: profileButton.render(),
      addUserButton: addUserButton.render(),
      deleteUserButton: deleteUserButton.render(),
      deleteChatButton: deleteChatButton.render(),
      chatSearchInput: chatSearchInput.render(),
      settingsButton: settingsButton.render(),
      modalWindowAddUser: modalWindowAddUser.render(),
      modalWindowDeleteUser: modalWindowDeleteUser.render(),
      modalWindowDeleteChat: modalWindowDeleteChat.render(),
      modalWindowCreateChat: modalWindowCreateChat.render(),
      chatListItems: chatListItems?.map((item: ChatListItem) => item.render()),
      selectedChatId: GlobalStore.get('selectedChatId'),
    });
  }
}

export default ChatList;
