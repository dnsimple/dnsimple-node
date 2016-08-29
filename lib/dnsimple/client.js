'use strict';

const https = require('https');
const querystring = require('querystring');

class Client {
  constructor(dnsimple) {
    this._dnsimple = dnsimple;
  }

  get(path, options, callback) {
    this.request('GET', path, null, options, callback);
  }

  post(path, data, options, callback) {
    this.request('POST', path, data, options, callback);
  }

  delete(path, options, callback) {
    this.request('DELETE', path, null, options, callback);
  }

  request(method, path, data, options, callback) {
    var timeout = this._dnsimple.timeout;
    var headers = {
      Authorization: 'Bearer ' + this._dnsimple.accessToken(),
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

    req.setTimeout(timeout, this._timeoutHandler(timeout, req, callback));
    req.on('response', this._responseHandler(req, callback));
    req.on('error', this._errorHandler(req, callback));
    req.on('socket', function(socket) {
      if (data != null) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  _timeoutHandler(timeout, req, callback) {
    var self = this;
    return function() {
      req._isAborted = true;
      req.abort();

      callback.call(self, {description: 'timeout'}, null);
    }
  }

  _responseHandler(req, callback) {
    var self = this;
    return function(res) {
      var data = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        if (res.statusCode == 401) {
          callback.call(self, {description: 'Authentication error'}, null);
        } else if (res.statusCode == 404) {
          callback.call(self, {description: 'Not found'}, null);
        } else if (res.statusCode == 429) {
          callback.call(self, {description: 'Too many request'}, null);
        } else if (res.statusCode == 204) {
          callback.call(self, null, {});
        } else {
          callback.call(self, null, JSON.parse(data));
        }
      });
    }
  }

  _errorHandler(req, callback) {
    var self = this;
    return function(error) {
      if (!req._isAborted) {
        var errorObj = {
          description: 'An error occurred communicating with DNSimple API',
          error: error,
        };
        callback.call(self, errorObj, null);
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
      versionedPath = versionedPath + '?' + querystring.stringify(query)
    }

    return versionedPath;
  }
}

module.exports = Client;
