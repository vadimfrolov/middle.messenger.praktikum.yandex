import { IChatsPageOptions } from '../../utils/interfaces';
import titles from '../../constants/titles';
import Block from '../../components/block/block';
import ChatList from '../../components/chatList/chatList';
import chats from './chats.html';
import './chats.less';

class Chats extends Block {
  constructor(rootId: string) {
    const chatListComponent = new ChatList();

    const options = {
      person: true,
      chatListComponent,
    };

    super(options, rootId);
  }

  render(): string {
    const {
      elementId,
      chatListComponent
    } = this.props as IChatsPageOptions;

    return chats({
      elementId: elementId,
      chatListComponent: chatListComponent.render(),
      titles,
    });
  }
}

export default Chats;
