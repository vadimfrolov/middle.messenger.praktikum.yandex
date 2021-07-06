// interface IGlobalStore {
//   state: Record<string, unknown>,
//   subscribers: Record<string, unknown>,
//   subscribe: (action: string, callback: () => void) => (() => void),
//   publish: (action: string) => void,
//   dispatchAction: (action: string, payload: Record<string, unknown> | Record<string, unknown>[]) => void,
//   unsubscribeAll: () => void,
//   get: (name: string) => Record<string, unknown> | Record<string, unknown>[] | string | number,
// }

enum ActionTypes {
  CHAT_LIST = 'chat_list',
  SELECTED_CHAT_ID = 'selected_chat_id',
  SELECTED_CHAT_TOKEN = 'selected_chat_token',
  CURRENT_USER = 'current_user',
  LOGOUT = 'logout',
  CHAT_MESSAGES = 'chat_messages'
}

class GlobalStore {
  static __instance: GlobalStore;
  static state: Record<string, unknown> = {
    chatMessages: {}
  }
  static subscribers: Record<string, unknown> = {}

  static subscribe(action: string, callback: () => void) {
    if (!Object.prototype.hasOwnProperty.call(this.subscribers, action)) {
      this.subscribers[action] = [];
    }

    (<(() => void)[]> this.subscribers[action]).push(callback);

    return () => this.subscribers[action] = (<(() => void)[]> this.subscribers[action]).filter(
      sub => sub !== callback
    );
  }

  static unsubscribeAll() {
    this.subscribers = {};
  }

  static dispatchAction(action: string, payload?: Record<string, unknown> | Record<string, unknown>[] | string | number) {
    this.state = (<(state: Record<string, unknown>, payload?: Record<string, unknown> | Record<string, unknown>[] | string | number)=>Record<string, unknown>>ACTIONS[action])(this.state, payload);
    this.publish(action);
  }

  static publish(action: string) {
    if (Object.prototype.hasOwnProperty.call(this.subscribers, action)) {
      (<((cb: Record<string, unknown>) => void)[]> this.subscribers[action]).forEach(cb => cb(this.state));
    }
  }

  static get(name: string) {
    return <Record<string, unknown> | Record<string, unknown>[] | string | number> this.state[name];
  }

}

const ACTIONS: Record<string, unknown> = {
  [ActionTypes.CHAT_LIST]: (state: Record<string, unknown>, payload: Record<string, unknown> | Record<string, unknown>[]) => ({
    ...state,
    chatList: payload
  }),

  [ActionTypes.SELECTED_CHAT_ID]: (state: Record<string, unknown>, payload: Record<string, unknown> | Record<string, unknown>[]) => ({
    ...state,
    selectedChatId: payload,
    selectedChatToken: null
  }),

  [ActionTypes.SELECTED_CHAT_TOKEN]: (state: Record<string, unknown>, payload: Record<string, unknown> | Record<string, unknown>[]) => ({
    ...state,
    selectedChatToken: payload
  }),

  [ActionTypes.CURRENT_USER]: (state: Record<string, unknown>, payload: Record<string, unknown> | Record<string, unknown>[]) => ({
    ...state,
    currentUser: payload
  }),

  [ActionTypes.CHAT_MESSAGES]: (state: Record<string, unknown>, payload: Record<string, unknown> | Record<string, unknown>[]) => ({
    ...state,
    chatMessages: payload
  }),

  [ActionTypes.LOGOUT]: () => ({})
};

export {
  GlobalStore,
  ActionTypes
};
