'use strict';

class Identity {
  constructor(client) {
    this._client = client;
  }

  whoami(callback) {
    var self = this;
    this._client.get('/whoami', function(error, response) {
      if (error != null) {
        callback.call(self, error, null);
      } else {
        callback.call(self, null, response);
      }
    });
  }
}

module.exports = Identity;
