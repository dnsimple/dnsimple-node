'use strict';

class Services {
  constructor(client) {
    this._client = client;
  }

  listServices(options = {}) {
    return this._client.get('/services', options);
  }

  getService(name, options = {}) {
    return this._client.get('/services/' + name, options);
  }
}

module.exports = Services;
