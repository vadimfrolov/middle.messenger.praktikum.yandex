import { ActionTypes, GlobalStore } from './store';

class ChatWebSocket {
  static __instance: ChatWebSocket;
  private socket;

  constructor(userId?: string, selectedChatId?: number, selectedChatToken?: string) {
    if (userId && selectedChatId && selectedChatToken) {
      this.socket?.close();
      this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${selectedChatId}/${selectedChatToken}`);
      this.socket.addEventListener('open', this.onOpen.bind(this));
      this.socket.addEventListener('message', this.onMessage.bind(this));
      this.socket.addEventListener('error', this.onError.bind(this));
      this.socket.addEventListener('close', this.onClose.bind(this));
    }

    if (ChatWebSocket.__instance) {
      return ChatWebSocket.__instance;
    }

    ChatWebSocket.__instance = this;
  }

  onOpen() {
    console.log('Соединение установлено');
    GlobalStore.dispatchAction(ActionTypes.CHAT_MESSAGES, []);
    this.send({
      content: '0',
      type: 'get old'
    });
  }

  onMessage(event: Record<string, string>) {
    console.log('Получены данные', event);
    const chatMessages: unknown = GlobalStore.get('chatMessages');
    const data = JSON.parse(event.data);

    GlobalStore.dispatchAction(ActionTypes.CHAT_MESSAGES,
      Array.isArray(data) ? [ ...(<Record<string, unknown>[]>chatMessages), ...data ] : [ ...(<Record<string, unknown>[]>chatMessages), data ]);
  }

  onError(event: Record<string, string>) {
    console.log('Ошибка', event.message);
  }

  onClose(event: Record<string, string>) {
    if (event.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения');
    }

    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
  }

  send(payload: Record<string, string>) {
    this.socket?.send(JSON.stringify(payload));
  }
}

export default ChatWebSocket;
