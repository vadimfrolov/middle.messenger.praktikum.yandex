
import chai from 'chai';
import jsdom from 'jsdom-global';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { IButtonOptions } from '../../utils/interfaces';
import Block from './block';

describe('Block component', () => {
  const defaultProps = { elementId: 'test' };
  const defaultTemplate = '<span id="test-id">string</span>';

  before(function() {
    this.jsdom = jsdom('<html><head></head><body><div id="app"></div></body></html>', { url: 'http://localhost' });
  });

  const createBlock = (options: IButtonOptions = defaultProps) => {
    class Test extends Block { render() { return defaultTemplate; }}

    return new Test(options);
  };

  describe('init function', () => {
    it('componentDidUpdate function should be called with old and new props', () => {
      const newProp = { buttonText: 'test'};
      const testBlock = createBlock();
      const componentDidUpdateSpy = sinon.spy(testBlock, 'componentDidUpdate');
      testBlock.setProps(<IButtonOptions>newProp);

      chai.expect(componentDidUpdateSpy).to.have.been.calledWith(defaultProps, newProp);
    });

    it('render function should render test component', () => {
      createBlock({ elementId: 'app' });

      chai.expect(document.body.innerHTML).to.be.equal(defaultTemplate);
    });

    it('attachListener function should return string', done => {
      createBlock({
        elementId: 'test-id',
        events: {
          click: () => done()
        }
      });

      document.body.querySelector('span')?.click();
    });
  });
});
