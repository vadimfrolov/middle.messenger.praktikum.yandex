import Handlebars from 'handlebars';

import redirections from '../../constants/redirections';
import titles from '../../constants/titles';
import '../../utils/handlebarsHelpers';
import { IButtonOptions, IErrorPageOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import Block from '../../components/block/block';
import Button from '../../components/button/button';
import notFound from './notFound.html';
import './notFound.less';

export class NotFound extends Block {
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
    const template = Handlebars.compile(notFound);
    const {
      elementId,
      returnToChatsButton
    } = this.props as IErrorPageOptions;

    return template({
      elementId: elementId,
      returnToChatsButton: returnToChatsButton.render(),
      titles,
    });
  }
}

export default NotFound;
