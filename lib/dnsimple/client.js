'use strict';

const https = require('https');
const querystring = require('querystring');

/**
 * An instance of the Client class provides low level HTTP wrapper methods.
 *
 * The service-specific classes delegate to an instance of Client to handle
 * the calls to the DNSimple API.
 */
class Client {
  constructor(dnsimple) {
    this._dnsimple = dnsimple;
  }

  baseUrl() {
    return this._dnsimple.baseUrl();
  }

  get(path, options) {
    return this.request('GET', path, null, options);
  }

  post(path, data, options) {
    return this.request('POST', path, data, options);
  }

  put(path, data, options) {
    return this.request('PUT', path, data, options);
  }

  patch(path, data, options) {
    return this.request('PATCH', path, data, options);
  }

  delete(path, options) {
    return this.request('DELETE', path, null, options);
  }

  request(method, path, data, options) {
    var timeout = this._dnsimple.timeout;
    var headers = {
      Authorization: `Bearer ${this._dnsimple.accessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this._dnsimple.userAgent(),
    };

    var req = https.request({
      host: this._dnsimple.baseUrl().hostname,
      port: this._dnsimple.baseUrl().port || 443,
      path: this._versionedPath(path, options),
      method: method,
      headers: headers,
    });

    return new Promise((resolve, reject) => {
      req.setTimeout(timeout, this._timeoutHandler(timeout, req, reject));
      req.on('response', this._responseHandler(req, resolve, reject));
      req.on('error', this._errorHandler(req, reject));
      req.on('socket', function(socket) {
        if (data != null) {
          req.write(JSON.stringify(data));
        }
        req.end();
      });
    });
  }

  _timeoutHandler(timeout, req, reject) {
    return () => {
      req._isAborted = true;
      req.abort();

      reject.call(this, {description: 'timeout'});
    }
  }

  _responseHandler(req, resolve, reject) {
    return (res) => {
      var data = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk });
      res.on('end', () => {
        try {
          if (res.statusCode == 401) {
            var error = JSON.parse(data);
            error.description = 'Authentication error'
            reject.call(this, error);
          } else if (res.statusCode == 404) {
            var error = JSON.parse(data);
            error.description = 'Not found'
            reject.call(this, error);
          } else if (res.statusCode == 405) {
            reject.call(this, {description: 'Method not allowed'});
          } else if (res.statusCode == 429) {
            reject.call(this, {description: 'Too many requests'});
          } else if (res.statusCode >= 400 && res.statusCode < 500) {
            var error = JSON.parse(data);
            error.description = 'Bad request'
            reject.call(this, error);
          } else if (res.statusCode == 204) {
            resolve.call(this, {});
          } else if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve.call(this, JSON.parse(data));
          } else if (res.statusCode >= 400) {
            reject.call(this, JSON.parse(data));
          } else {
            reject.call(this, `Unsupported status code: ${res.statusCode}`);
          }
        } catch (e) {
          reject.call(this, e.message);
        }
      });
    }
  }

  _errorHandler(req, reject) {
    return (error) => {
      if (!req._isAborted) {
        var errorObj = {
          description: 'An error occurred communicating with DNSimple API',
          error: error,
        };
        reject.call(this, errorObj);
      }
    }
  }

  _versionedPath(path, options) {
    var versionedPath = '/v2' + path;
    var query = {};

    if (!(typeof options.query === 'undefined')) {
      for (let key in options.query) {
        query[key] = options.query[key];
      }
      delete options.query;
    }

    if (!(typeof options.filter === 'undefined')) {
      for (let key in options.filter) {
        query[key] = options.filter[key];
      }
      delete options.filter;
    }

    for (let key in options) {
      query[key] = options[key];
    }

    if (Object.keys(query).length > 0) {
      versionedPath = `${versionedPath}?${querystring.stringify(query)}`;
    }

    return versionedPath;
  }
}

module.exports = Client;
