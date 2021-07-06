import errors from '../../constants/errors';
import EventBus from '../../utils/eventBus';
import { IOptions } from '../../utils/interfaces';
import { generateRandomString } from '../../utils/utils';

enum EVENTS {
  INIT = 'init',
  FLOW_CDM = 'component did mount',
  FLOW_CDU = 'component did update',
  FLOW_RENDER = 'render',
  AFTER_RENDER = 'after render',
}

abstract class Block {
  _element: HTMLElement;
  _rootId: string | undefined;
  props: IOptions;
  eventBus: () => EventBus;

  constructor(props: IOptions = {}, rootId?: string, elementId: string = generateRandomString()) {
    const eventBus = new EventBus();
    this._rootId = rootId;
    if (!props.elementId) {
      props.elementId = elementId;
    }
    this.props = this._makePropsProxy({...props});
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(EVENTS.INIT, this.init.bind(this));
    eventBus.on(EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(EVENTS.AFTER_RENDER, this._afterRender.bind(this));
  }

  private _createResources(): void {
    this._element = document.createElement('div');
  }

  private _checkIsPropsChanged(nextProps: IOptions): boolean {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.every((key: keyof IOptions) => nextProps[key] === this.props[key] )) {
      return false;
    }

    return true;
  }

  init(): void {
    this._createResources();
    this.eventBus().emit(EVENTS.FLOW_CDM);
  }

  private _componentDidMount(oldProps: IOptions) {
    this.componentDidMount(oldProps);
    this.eventBus().emit(EVENTS.FLOW_RENDER);
  }

  componentDidMount(oldProps: IOptions): void {
    oldProps;
  }

  private _componentDidUpdate(oldProps: IOptions, newProps: IOptions) {
    const response = this.componentDidUpdate(oldProps, newProps);
    response && this.eventBus().emit(EVENTS.FLOW_RENDER);
  }

  componentDidUpdate(oldProps: IOptions, newProps: IOptions): boolean {
    return newProps !== oldProps;
  }

  setProps(nextProps: IOptions): void {
    const oldProps = {...this.props};
    const isPropsChanged = this._checkIsPropsChanged(nextProps);
    if (isPropsChanged) {
      Object.assign(this.props, nextProps);
      this.eventBus().emit(EVENTS.FLOW_CDU, oldProps, nextProps);
    }
  }

  detachListeners(): void {
    const rootElement = document.querySelector(`#${this.props.elementId}`);
    const formElement = document.querySelector('form');

    if (formElement && this.props.submitFormHandler) {
      formElement.removeEventListener('submit', this.props.submitFormHandler);
    }

    if (this.props.events && rootElement) {
      Object.keys(this.props.events).forEach((key: keyof ElementEventMap) => {
        rootElement.removeEventListener(key, this.props.events![key]);
      });
    }

    Object.keys(this.props).forEach((key: keyof IOptions) => {
      if (this.props[key] instanceof Block) {
        (<Block> this.props[key]).detachListeners();
      } else if (Array.isArray(this.props[key]) && (<Block[]> this.props[key])[0]?.props?.elementId) {
        (<Block[]> this.props[key]).forEach((el: Block) => el.detachListeners());
      }
    });
  }

  attachListeners(): void {
    const rootElement = document.querySelector(`#${this.props.elementId}`);
    const formElement = document.querySelector('form');

    if (formElement && this.props.submitFormHandler) {
      formElement.addEventListener('submit', this.props.submitFormHandler);
    }

    if (this.props.events && rootElement) {
      Object.keys(this.props.events).forEach(key => {
        rootElement.addEventListener(key, this.props.events![key]);
      });
    }

    Object.keys(this.props).forEach((key: keyof IOptions) => {
      if (this.props[key] instanceof Block) {
        (<Block> this.props[key]).attachListeners();
      } else if (Array.isArray(this.props[key]) && (<Block[]> this.props[key])[0]?.props?.elementId) {
        (<Block[]> this.props[key])?.forEach((el: Block) => el.attachListeners());
      }
    });
  }

  get element(): HTMLElement {
    return <HTMLElement> this._element.firstElementChild;
  }

  private _render(): void {
    const block = this.render();
    this.detachListeners();

    const rootElement = document.getElementById(this._rootId ?? '');
    this._element.innerHTML = block;

    if (rootElement) {
      rootElement.innerHTML = '';
      rootElement.appendChild(this.element);
    }
    if (!this._rootId) {
      const elementSelf = document.getElementById(this.props.elementId ?? '');

      if (elementSelf) {
        elementSelf.outerHTML = (<HTMLElement> this.element).outerHTML;
      }
    }

    this.attachListeners();
    this.eventBus().emit(EVENTS.AFTER_RENDER);
  }

  abstract render(): string

  afterRender(elementId?: string): void { elementId; }

  private _afterRender(): void {
    this.afterRender(this.props.elementId);
  }

  private _makePropsProxy(props: IOptions): IOptions {
    const _checkPropIsInternal = (prop: string): void => {
      if (prop.startsWith('_')) {
        throw new Error(errors.NOT_ALLOWED);
      }
    };

    const proxyProps = new Proxy(props, {
      get(target, prop: keyof IOptions) {
        _checkPropIsInternal(<string> prop);
        const value = target[prop];

        return (typeof value === 'function') ? (<() => void> value).bind(target) : value;
      },

      set(target, prop: keyof IOptions, value) {
        _checkPropIsInternal(<string> prop);

        if (prop === 'elementId') {
          throw new Error(errors.NOT_ALLOWED);
        }
        target[prop] = value;

        return true;
      },

      deleteProperty(target, prop: keyof IOptions) {
        _checkPropIsInternal(<string> prop);
        delete target[prop];

        return true;
      },
    });

    return proxyProps;
  }

  show() {
    const rootElement = document.getElementById(this._rootId ?? '');
    if (rootElement) {
      rootElement.style.display = 'block';
    }
  }

  hide() {
    const rootElement = document.getElementById(this._rootId ?? '');
    if (rootElement) {
      rootElement.style.display = 'none';
    }
  }
}

export default Block;
