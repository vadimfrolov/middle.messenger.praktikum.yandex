import errors from '../constants/errors';
import { IOptions } from './interfaces';

class EventBus {
  listeners: Record<string, ((...args: IOptions[]) => void)[]>;

  constructor() {
    this.listeners = {};
  }

  _checkEvent(event: string): void {
    if (!this.listeners[event]) {
      throw new Error(errors.EVENT_NOT_FOUND(event));
    }
  }

  on(event: string, callback: () => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: () => void): void {
    this._checkEvent(event);

    this.listeners[event] = this.listeners[event].filter(
      (listener: () => void) => listener !== callback
    );
  }

  emit(event: string, ...args: IOptions[]): void {
    this._checkEvent(event);

    this.listeners[event].forEach((listener: (...args: IOptions[]) => void) => listener(...args));
  }
}

export default EventBus;
