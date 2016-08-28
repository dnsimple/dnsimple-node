'use strict';

class Identity {
  constructor(client) {
    this._client = client;
  }

  whoami(callback) {
    var self = this;
    this._client.get('/whoami', callback);
  }
}

module.exports = Identity;
