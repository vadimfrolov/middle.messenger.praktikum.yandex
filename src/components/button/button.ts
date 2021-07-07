import Handlebars from 'handlebars';

import '../../utils/handlebarsHelpers';
import { IButtonOptions } from '../../utils/interfaces';
import Block from '../block/block';
import button from './button.html';
import './button.less';

class Button extends Block {
  constructor(options: IButtonOptions, rootId?: string) {
    let newDataOption = {...options};
    newDataOption.buttonClass = options.buttonClass ? ` ${options.buttonClass}` : '';
    newDataOption.buttonType = options.buttonType || 'button';
    super(newDataOption, rootId);
  }

  render(): string {
    const template = Handlebars.compile(button);

    return template(this.props);
  }
}

export default Button;
