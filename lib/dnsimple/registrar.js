'use strict';

class Registrar {
  constructor(client) {
    this._client = client;
  }

  checkDomain(accountId, domainName, options = {}) {
    return this._client.get('/' + accountId + '/registrar/domains/' + domainName + '/check', options);
  }

  registerDomain(accountId, domainName, attributes, options = {}) {
    // Note: registrar_id is required, but no validation occurs here.
    // In the ruby library this is validated here.
    let path = '/' + accountId + '/registrar/domains/' + domainName + '/registration'
    return this._client.post(path, attributes, options);
  }
}

module.exports = Registrar;
