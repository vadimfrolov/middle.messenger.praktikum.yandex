import Aside from '../components/aside/aside';
import Avatar from '../components/avatar/avatar';
import Button from '../components/button/button';
import Input from '../components/input/input';
import ChatList from '../components/chatList/chatList';
import Modal from '../components/modal/modal';
import ChatListItem from '../components/chatListItem/chatListItem';
import Block from '../components/block/block';

interface IPage {
  new (rootId: string): Block;
}

interface IRouteOptions {
  rootQuery: string;
}
interface IOptions {
  events?: Record<string, (event: Event) => void>;
  elementId?: string;
  person?: boolean;
  block?: Block;
  blockArray?: Block[];
  submitFormHandler?: (event: Event) => void;
}

interface IButtonOptions extends IOptions {
  buttonText?: string;
  buttonType?: string;
  buttonClass?: string;
  buttonImg?: string;
}

interface IAlertOptions extends IOptions {
  alertClass: string;
  message: string;
  closeButton?: Button;
}

interface IInputOptions extends IOptions {
  inputId?: string;
  label?: string;
  inputType?: string;
  inputClass?: string;
  inputPlaceholder?: string;
  info?: string;
  name?: string;
  errorMessage?: string;
  error?: string | boolean;
  validateFunctions: Array<(value: string | undefined) => string>;
}

interface ILoginPageOptions extends IOptions {
  loginButton: Button;
  registerButton: Button;
  loginInput: Input;
  passwordInput: Input;
}

interface ISignupPageOptions extends IOptions {
  signupButton: Button;
  rememberAllButton: Button;
  emailInput: Input;
  loginInput: Input;
  nameInput: Input;
  surnameInput: Input;
  phoneInput: Input;
  passwordInput: Input;
  passwordRepeatInput: Input;
}

interface IErrorPageOptions extends IOptions {
  returnToChatsButton: Button;
}

interface IAsideOptions extends IOptions {
  backButton: Button;
}

interface IAvatarOptions extends IOptions {
  avatarClass?: string;
  isNoUpload?: boolean;
  avatarSrc?: string;
  avatarError?: string;
  avatarInput?: Input;
  uploadAvatar?: (event: Event) => void;
}

interface IChatListItemOptions extends IOptions {
  className?: string;
  title?: string;
  avatar?: string | null;
  lastMessage: Record<string, string | Record<string, string>>;
  time: string;
  unread_count?: number | null;
  selectedChatId?: string;
  profileAvatar?: Avatar;
  id: number;
}

interface IProfilePageOptions extends IOptions {
  aside: Aside;
  profileAvatar: Avatar;
  changeInfoButton: Button;
  changePasswordButton: Button;
  logoutButton: Button;
  profileInfo: Record<string, unknown>,
}

interface IProfileEditPageOptions extends IOptions {
  aside: Aside;
  profileAvatar: Avatar;
  saveButton: Button;
  emailInput: Input;
  loginInput: Input;
  nameInput: Input;
  surnameInput: Input;
  chatNameInput: Input;
  phoneInput: Input;
}

interface IChangePasswordPageOptions extends IOptions {
  aside: Aside;
  profileAvatar: Avatar;
  saveButton: Button;
  oldPasswordInput: Input,
  passwordInput: Input,
  passwordRepeatInput: Input,
}

interface IModalOptions extends IOptions {
  modalTitle: string;
  modalInput?: Input;
  modalButton: Button;
  modalCancelButton?: Button;
  modalText?: string;
}

interface IChatsPageOptions extends IOptions {
  chatListComponent: ChatList;
}

interface IChatPageOptions extends IOptions {
  profileAvatar: Avatar,
  chatInput: Input,
  submitButton: Button,
  chatNameButton: Button,
  modalWindowRenameChat: Modal,
  chatListComponent: ChatList,
  chatMessages: Record<string, string>[],
}

interface IChatListOptions extends IOptions {
  settingsButton: Button;
  createChatButton: Button;
  profileButton: Button;
  addUserButton: Button;
  deleteUserButton: Button;
  deleteChatButton: Button;
  chatSearchInput: Input;
  modalWindowAddUser: Modal,
  modalWindowDeleteUser: Modal,
  modalWindowDeleteChat: Modal,
  modalWindowCreateChat: Modal,
  chatListItems: ChatListItem[],
  selectedChatId: string,
}

export {
  IButtonOptions,
  IAlertOptions,
  IInputOptions,
  IOptions,
  ILoginPageOptions,
  ISignupPageOptions,
  IErrorPageOptions,
  IAsideOptions,
  IAvatarOptions,
  IChatListItemOptions,
  IProfilePageOptions,
  IProfileEditPageOptions,
  IChangePasswordPageOptions,
  IModalOptions,
  IChatListOptions,
  IChatsPageOptions,
  IChatPageOptions,
  IPage,
  IRouteOptions,
};
