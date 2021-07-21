import { IModalOptions, IOptions } from '../../utils/interfaces';
import Block from '../block/block';
import modal from './modal.html';
import './modal.less';

class Modal extends Block {
  constructor(options: IModalOptions, rootId?: string) {
    options.events = {
      click: () => this._closeModal()
    };

    super(options, rootId);
  }

  private _closeModal() {
    const openedModal = document.querySelector(`#${(<IModalOptions> this.props).elementId}`);
    openedModal?.classList.remove('modal-open');
  }

  detachListeners(): void {
    const modalOverlay = document.querySelector(`#${(<IModalOptions> this.props).elementId} .modal-overlay`);

    if (this.props.events && modalOverlay) {
      Object.keys(this.props.events).forEach(key => {
        modalOverlay.removeEventListener(key, this.props.events![key]);
      });
    }

    Object.keys(this.props).forEach((key: keyof IOptions) => {
      if (this.props[key] instanceof Block) {
        (<Block> this.props[key]).detachListeners();
      }
    });
  }

  attachListeners(): void {
    const modalOverlay = document.querySelector(`#${(<IModalOptions> this.props).elementId} .modal-overlay`);

    if (this.props.events && modalOverlay) {
      Object.keys(this.props.events).forEach(key => {
        modalOverlay.addEventListener(key, this.props.events![key]);
      });
    }

    Object.keys(this.props).forEach((key: keyof IOptions) => {
      if (this.props[key] instanceof Block) {
        (<Block> this.props[key]).attachListeners();
      }
    });
  }

  render(): string {
    const { modalInput, modalButton, modalCancelButton } = this.props as IModalOptions;

    return modal({
      ...this.props,
      modalInput: modalInput?.render(),
      modalButton: modalButton.render(),
      modalCancelButton: modalCancelButton?.render(),
    });
  }
}

export default Modal;
