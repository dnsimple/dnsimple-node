'use strict';

class Registrar {
  constructor(client) {
    this._client = client;
  }

  checkDomain(accountId, domainId, options = {}) {
    return this._client.get('/' + accountId + '/registrar/domains/' + domainId + '/check', options);
  }
}

module.exports = Registrar;
