'use strict';

class Domains {
  constructor(client) {
    this._client = client;
  }

  listDomains(accountId, callback) {
    var self = this;
    this._client.get('/' + accountId + '/domains', callback);
  }
}

module.exports = Domains;
