import 'regenerator-runtime/runtime';
import { expect } from 'chai';
import jsdom from 'jsdom-global';

import { NotFound } from '../pages/notFound/notFound';
import { Oops } from '../pages/oops/oops';
import { Router } from './router';

describe('Router', () => {
  before(function() {
    this.jsdom = jsdom('<html><head></head><body><div id="app"></div></body></html>', { url: 'http://localhost' });
  });

  beforeEach(function() {
    Router
      .use('/not_found', NotFound)
      .use('/oops', Oops)
      .start();

    window.history.pushState({ name: 'back' }, 'not found', 'http://localhost/not_found');
    window.history.pushState({ name: 'oops' }, 'oops', 'http://localhost/oops');
  });

  it('state of Router should be increased', () => {
    const startLength = Router.history.length;

    window.history.pushState({}, 'test', 'http://localhost/test');
    window.history.pushState({}, 'test2', 'http://localhost/test2');

    expect(Router.history.length).to.eq(startLength + 2);
  });

  it('function "back" should return previos pathname ', done => {
    const expectedResult = 'http://localhost/not_found';
    Router.back();
    window.onpopstate = () => {
      expect(window.location.href).be.equal(expectedResult);
      done();
    };
  });

  it('function "go" should return choosen pathname ', () => {
    const expectedResult = '/test';
    Router.go(expectedResult);

    expect(window.location.href).be.equal(`http://localhost${expectedResult}`);
  });

  it('function "getRoute" should return choosen route ', () => {
    const expectedResult = '/not_found';
    const result = Router.getRoute(expectedResult)?._pathname;

    expect(result).be.equal(expectedResult);
  });
});
