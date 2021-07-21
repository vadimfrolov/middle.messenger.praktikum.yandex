import { IAsideOptions, IButtonOptions } from '../../utils/interfaces';
import Router from '../../utils/router';
import Block from '../block/block';
import Button from '../button/button';
import aside from './aside.html';
import './aside.less';

class Aside extends Block {
  constructor() {
    const backButtonOptions: IButtonOptions = {
      buttonImg: '/assets/submit.svg',
      buttonClass: 'button-round button-transform',
      events: { click: () => this._redirect() }
    };

    const backButton = new Button(backButtonOptions);
    const options = {
      person: true,
      backButton,
    };

    super(options);
  }

  private _redirect(): void {
    Router.back();
  }

  render(): string {
    const { backButton } = this.props as IAsideOptions;

    return aside({
      elementId: this.props.elementId,
      backButton: backButton.render(),
    });
  }
}

export default Aside;
