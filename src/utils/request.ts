const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export interface IRequestOptions {
  timeout?: number;
  method?: string;
  data?: Record<string, unknown> | FormData;
  isFormData?: boolean;
  headers?: Record<string, string>;
}

export function queryStringify(data: Record<string, unknown>) {
  let str = '?';
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      str += `${key}=${data[key]}&`;
    }
  }

  return str.slice(0, str.length - 1);
}

export class HTTPTransport {
  _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  get(url: string, options: IRequestOptions = {}): Promise<XMLHttpRequest | string> {
    return this.request(`${this._baseUrl}${url}`, { ...options, method: METHODS.GET }, options.timeout);
  }

  delete(url: string, options: IRequestOptions = {}): Promise<XMLHttpRequest | string> {
    return this.request(`${this._baseUrl}${url}`, { ...options, method: METHODS.DELETE }, options.timeout);
  }

  post(url: string, options: IRequestOptions = {}): Promise<XMLHttpRequest | string> {
    return this.request(`${this._baseUrl}${url}`, { ...options, method: METHODS.POST }, options.timeout);
  }

  put(url: string, options: IRequestOptions = {}): Promise<XMLHttpRequest | string> {
    return this.request(`${this._baseUrl}${url}`, { ...options, method: METHODS.PUT }, options.timeout);
  }

  request(url: string, options: IRequestOptions, timeout = 5000): Promise<XMLHttpRequest | string> {
    const { method, data, isFormData, headers } = options;
    let path = url;

    if (method === METHODS.GET && data) {
      path = `${url}${queryStringify(<Record<string, unknown>>data)}`;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.timeout = timeout;
      xhr.open(method!, path);

      xhr.onload = function() {
        if (xhr.status >= 500) {
          reject(xhr.response);

          return;
        }

        if (400 <= xhr.status && xhr.status < 500) {
          resolve('[]');
        }

        if (xhr.status !== 200) {
          reject(JSON.parse(xhr.response));
        }
        resolve(xhr.response);
      };

      if (!isFormData) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      xhr.withCredentials = true;
      headers && Object.entries(headers).map(entry => xhr.setRequestHeader(...entry));

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        if (!isFormData) {
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send(<FormData>data);
        }
      }
    });
  }
}

export default  HTTPTransport;
