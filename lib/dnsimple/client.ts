import type Dnsimple = require("../dnsimple");
import https = require('https');
import querystring = require('querystring');
import type { RequestOptions } from "./request";

/**
 * An instance of the Client class provides low level HTTP wrapper methods.
 *
 * The service-specific classes delegate to an instance of Client to handle
 * the calls to the DNSimple API.
 */
class Client {
  constructor (private readonly _dnsimple: Dnsimple) {
  }

  baseUrl () {
    return this._dnsimple.baseUrl();
  }

  get (path: string, options: RequestOptions) {
    return this.request('GET', path, null, options);
  }

  post (path: string, data: any, options: RequestOptions) {
    return this.request('POST', path, data, options);
  }

  put (path: string, data: any, options: RequestOptions) {
    return this.request('PUT', path, data, options);
  }

  patch (path: string, data: any, options: RequestOptions) {
    return this.request('PATCH', path, data, options);
  }

  delete (path: string, options: RequestOptions) {
    return this.request('DELETE', path, null, options);
  }

  request (method: string, path: string, data: any, options: RequestOptions) {
    const timeout = this._dnsimple.timeout;
    const headers = {
      Authorization: `Bearer ${this._dnsimple.accessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this._dnsimple.userAgent()
    };
    let aborted = false;

    return new Promise((resolve, reject) => {
      const req = https.request({
        host: this._dnsimple.baseUrl().hostname,
        port: this._dnsimple.baseUrl().port || 443,
        path: this._versionedPath(path, options),
        method,
        headers,
        timeout,
      })
        .on('timeout', () => {
          aborted = true;
          req.destroy();
          reject({ description: 'timeout' });
        })
        .on('error', error => {
          if (!aborted) {
            reject({
              description: 'An error occurred communicating with DNSimple API',
              error,
            });
          }
        })
        .on('response', res => {
          const chunks = Array<Buffer>();
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => {
            const status = res.statusCode!;
            const data = Buffer.concat(chunks).toString("utf-8");
            try {
              if (status === 401) {
                reject({ ...JSON.parse(data), description: 'Authentication error' });
              } else if (status === 404) {
                reject({ ...JSON.parse(data), description: 'Not found' });
              } else if (status === 405) {
                reject({ description: 'Method not allowed' });
              } else if (status === 429) {
                reject({ description: 'Too many requests' });
              } else if (status >= 400 && status < 500) {
                reject({
                  ...JSON.parse(data),
                  description: 'Bad request',
                  // This is a standard method across all our clients to get the errors from a failed response.
                  attributeErrors: function () {
                    return this.errors;
                  },
                });
              } else if (status === 204) {
                resolve({});
              } else if (status >= 200 && status < 300) {
                resolve(JSON.parse(data));
              } else if (status >= 400) {
                resolve(JSON.parse(data));
              } else {
                reject(`Unsupported status code: ${status}`);
              }
            } catch (e) {
              reject(e.message);
            }
          });
        })
        .end(data == null ? undefined : JSON.stringify(data));
    });
  }

  private _versionedPath (path: string, {query = {}, filter = {}, ...params}: RequestOptions) {
    let versionedPath = `/v2${path}`;
    const parsed: querystring.ParsedUrlQueryInput = {
      ...query,
      ...filter,
      ...params,
    };

    if (Object.keys(parsed).length > 0) {
      versionedPath = `${versionedPath}?${querystring.stringify(parsed)}`;
    }

    return versionedPath;
  }
}

export = Client;
