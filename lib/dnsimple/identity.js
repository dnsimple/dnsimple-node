'use strict';

class Identity {
  constructor(client) {
    this._client = client;
  }

  whoami(options, callback) {
    this._client.get('/whoami', options, callback);
  }
}

module.exports = Identity;
