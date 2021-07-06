import HTTP from '../utils/request';

const chatsAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/chats');

class ChatAPI {
  private chats: XMLHttpRequest | string | null = null;
  private chatUsers: XMLHttpRequest | string | null = null;
  private currentChatToken: XMLHttpRequest | string | null =  null;

  async getChats(payload = {}) {
    this.chats = this.chats ?? await chatsAPIInstance.get('/', { data: payload });
    setTimeout(() => {
      this.chats = null;
    }, 1000);

    return this.chats;
  }

  createChat(payload: Record<string, string>) {
    return chatsAPIInstance.post('/', { data: payload });
  }

  deleteChat(payload: Record<string, string>) {
    return chatsAPIInstance.delete('/', { data: payload });
  }

  addUsersToChat(payload: Record<string, string[] | string>) {
    return chatsAPIInstance.put('/users', { data: payload });
  }

  removeUsersFromChat(payload: Record<string, string[] | string>) {
    return chatsAPIInstance.delete('/users', { data: payload });
  }

  async getChatUsers(id: string, payload = {}) {
    this.chatUsers = this.chatUsers ?? await chatsAPIInstance.get(`/${id}/users`, { data: payload });
    setTimeout(() => {
      this.chatUsers = null;
    }, 1000);

    return this.chatUsers;
  }

  async getCurrentChatToken(id: number) {
    this.currentChatToken = this.currentChatToken ?? await chatsAPIInstance.post(`/token/${id}`);
    setTimeout((() => {
      this.currentChatToken = null;
    }), 1000);

    return this.currentChatToken;
  }

  uploadAvatar(payload: FormData) {
    return chatsAPIInstance.put('/avatar', { data: payload, isFormData: true });
  }
}

export default ChatAPI;
