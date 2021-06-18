type Callback = (...args: any[]) => void;

interface EventEmitter {
  on(event: string, callback: Callback): void;
  off(event: string, callback: Callback): void;
  emit(event: string, ...restArgs: any[]): void;
}

export class EventBus implements EventEmitter {
  protected listeners: { [event: string]: Callback[] };

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: Callback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: Callback): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event].forEach(function (listener) {
      listener(...args);
    });
  }
}
