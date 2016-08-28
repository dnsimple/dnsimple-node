'use strict';

const https = require('https');

class Client {
  constructor(dnsimple) {
    this._dnsimple = dnsimple;
  }

  get(path, callback) {
    this.request('GET', path, null, callback);
  }

  request(method, path, data, callback) {
    var requestData;

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
      path: this._versionedPath(path),
      method: method,
      headers: headers,
    });

    req.setTimeout(timeout, this._timeoutHandler(timeout, req, callback));
    req.on('response', this._responseHandler(req, callback));
    req.on('error', this._errorHandler(req, callback));
    req.on('socket', function(socket) {
      if (requestData != null) {
        req.write(requestData);
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

  _versionedPath(path) {
    return '/v2' + path;
  }
}

module.exports = Client;
