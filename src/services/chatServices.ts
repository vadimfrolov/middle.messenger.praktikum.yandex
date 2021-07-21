import errors from '../constants/errors';
import ChatsApi from '../api/chatsApi';

export const getChats = async (title = '') => {
  try {
    const chats = title ? await new ChatsApi().getChats({ title }) : await new ChatsApi().getChats();
    const parsedChats = JSON.parse(<string>chats);

    return parsedChats.map((chat: Record<string, unknown>) => {
      // chat.last_message = JSON.parse(<string>chat.last_message);

      return chat;
    });
  } catch (err) {
    throw new Error(`${errors.RESPONSE_FAILED}: ${err?.reason || err}`);
  }
};
