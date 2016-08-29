'use strict';

class Identity {
  constructor(client) {
    this._client = client;
  }

  whoami(options) {
    return this._client.get('/whoami', options);
  }
}

module.exports = Identity;
