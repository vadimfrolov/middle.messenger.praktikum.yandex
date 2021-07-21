import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import { IButtonOptions, IErrorPageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import oops from './oops.html';
import './oops.less';

export class Oops extends Block {
  constructor(rootId: string) {

    const returnToChatsButtonOptions: IButtonOptions = {
      buttonText: titles.RETURN_TO_CHATS,
      buttonClass: 'button-big',
      events: { click: () => this._redirect() }
    };

    const returnToChatsButton = new Button(returnToChatsButtonOptions);

    const options = {
      person: true,
      returnToChatsButton,
    };

    super(options, rootId);
  }

  private _redirect(): void {
    Router.go(redirections.LOGOUT);
  }

  render(): string {
    const {
      elementId,
      returnToChatsButton
    } = this.props as IErrorPageOptions;

    return oops({
      elementId: elementId,
      returnToChatsButton: returnToChatsButton.render(),
      titles,
    });
  }
}

export default Oops;
