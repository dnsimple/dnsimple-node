'use strict';

class Domains {
  constructor(client) {
    this._client = client;
  }

  listDomains(accountId, callback) {
    var self = this;
    this._client.get('/' + accountId + '/domains', function(error, response) {
      if (error != null) {
        callback.call(self, error, null);
      } else {
        callback.call(self, null, response);
      }
    });
  }
}

module.exports = Domains;
