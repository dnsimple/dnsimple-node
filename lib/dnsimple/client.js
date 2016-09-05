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
    var self = this;

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

    return new Promise(function(resolve, reject) {
      req.setTimeout(timeout, self._timeoutHandler(timeout, req, reject));
      req.on('response', self._responseHandler(req, resolve, reject));
      req.on('error', self._errorHandler(req, reject));
      req.on('socket', function(socket) {
        if (data != null) {
          req.write(JSON.stringify(data));
        }
        req.end();
      });
    });
  }

  _timeoutHandler(timeout, req, reject) {
    var self = this;
    return function() {
      req._isAborted = true;
      req.abort();

      reject.call(self, {description: 'timeout'});
    }
  }

  _responseHandler(req, resolve, reject) {
    var self = this;
    return function(res) {
      var data = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        if (res.statusCode == 400) {
          reject.call(self, {description: 'Bad request'});
        } else if (res.statusCode == 401) {
          reject.call(self, {description: 'Authentication error'});
        } else if (res.statusCode == 404) {
          reject.call(self, {description: 'Not found'});
        } else if (res.statusCode == 429) {
          reject.call(self, {description: 'Too many request'});
        } else if (res.statusCode == 204) {
          resolve.call(self, {});
        } else {
          resolve.call(self, JSON.parse(data));
        }
      });
    }
  }

  _errorHandler(req, reject) {
    var self = this;
    return function(error) {
      if (!req._isAborted) {
        var errorObj = {
          description: 'An error occurred communicating with DNSimple API',
          error: error,
        };
        reject.call(self, errorObj);
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

  /**
   * Get the next page in pagination results by calling the function `f`
   * with the arguments `args` starting at the given page (defaults to
   * page 1).
   *
   * @return {Promise}
   */
  _nextPage(f, args, page = 1) {
    var self = this;
    return new Promise(function(resolve, reject) {
      Object.assign(args[args.length - 1], {page: page});
      f.apply(self, args).then(function(response) {
        if (page < response.pagination.total_pages) {
          return new Promise(function(resolve, reject) {
            // Recursively call _nextPage while incrementing the page number
            self._client._nextPage.call(self, f, args, page + 1).then(function(nextResponse) {
              resolve.call(self, nextResponse);
            });
          }).then(function(responses) {
            resolve.call(self, [response].concat(responses));
          });
        }
        // No more pages left
        resolve.call(self, [response]);
      });
    });
  }
}

module.exports = Client;
