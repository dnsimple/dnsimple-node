'use strict';

var Account = require('./account');

function Identity(client) {
  if (!(this instanceof Identity)) {
    return new Identity(client);
  }

  this._client = client;
}

Identity.prototype = {
  whoami: function(callback) {
    var self = this;
    this._client.get('/whoami', function(error, response) {
      if (error != null) {
        callback.call(self, error, null);
      } else {
        callback.call(self, null, new Account(response.data.account));
      }
    });
  },
}

module.exports = Identity;
