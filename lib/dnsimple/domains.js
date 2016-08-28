'use strict';

class Domains {
  constructor(client) {
    this._client = client;
  }

  listDomains(accountId, callback) {
    this._client.get('/' + accountId + '/domains', callback);
  }

  domain(accountId, domainId, callback) {
    this._client.get('/' + accountId + '/domains/' + domainId, callback);
  }
}

module.exports = Domains;
