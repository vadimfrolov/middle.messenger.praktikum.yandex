import 'regenerator-runtime/runtime';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { HTTPTransport, queryStringify } from './request';

describe('queryStringify', () => {
  it('should return string', () => {
    const data = { key: 1, key2: 2 };
    const expectedResult = '?key=1&key2=2';

    const result = queryStringify(data);
    chai.expect(result).to.equal(expectedResult);
  });
});

describe('HTTPTransport', () => {
  let request: HTTPTransport;

  beforeEach(() => {
    request = new HTTPTransport('http://localhost');
  });

  it('get should return request with correct params', () => {
    const requestSpy = sinon.spy(request, 'request');
    request.get('/test');

    chai.expect(requestSpy).to.have.been.calledWith('http://localhost/test', { method: 'GET' });
  });

  it('post should return request with correct params', () => {
    const requestSpy = sinon.spy(request, 'request');
    request.post('/test');

    chai.expect(requestSpy).to.have.been.calledWith('http://localhost/test', { method: 'POST' });
  });

  it('put should return request with correct params', () => {
    const requestSpy = sinon.spy(request, 'request');
    request.put('/test');

    chai.expect(requestSpy).to.have.been.calledWith('http://localhost/test', { method: 'PUT' });
  });

  it('delete should return request with correct params', () => {
    const requestSpy = sinon.spy(request, 'request');
    request.delete('/test');

    chai.expect(requestSpy).to.have.been.calledWith('http://localhost/test', { method: 'DELETE' });
  });
});
