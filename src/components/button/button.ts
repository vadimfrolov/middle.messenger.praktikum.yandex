import { IButtonOptions } from '../../utils/interfaces';
import Block from '../block/block';
import button from './button.html';
import './button.less';

class Button extends Block {
  constructor(options: IButtonOptions, rootId?: string) {
    options.buttonClass = options.buttonClass ? ` ${options.buttonClass}` : '';
    options.buttonType = options.buttonType || 'button';

    super(options, rootId);
  }

  render(): string {
    return button({...this.props});
  }
}

export default Button;
