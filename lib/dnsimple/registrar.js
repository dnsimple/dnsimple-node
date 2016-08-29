'use strict';

class Registrar {
  constructor(client) {
    this._client = client;
  }

  checkDomain(accountId, domainName, options = {}) {
    return this._client.get(this._registrar_path(accountId, domainName, 'check'), options);
  }

  registerDomain(accountId, domainName, attributes, options = {}) {
    // Note: registrar_id is required, but no validation occurs here.
    // In the ruby library this is validated.
    return this._client.post(this._registrar_path(accountId, domainName, 'registration'), attributes, options);
  }

  renewDomain(accountId, domainName, attributes, options = {}) {
    return this._client.post(this._registrar_path(accountId, domainName, 'renewal'), attributes, options);
  }

  transferDomain(accountId, domainName, attributes, options = {}) {
    // Note: registrar_id is required, but no validation occurs here.
    // In the ruby library this is validated.
    return this._client.post(this._registrar_path(accountId, domainName, 'transfer'), attributes, options);
  }

  transferDomainOut(accountId, domainName, options = {}) {
    return this._client.post(this._registrar_path(accountId, domainName, 'transfer_out'), null, options);
  }

  _registrar_path(accountId, domainName, resource) {
    return '/' + accountId + '/registrar/domains/' + domainName + '/' + resource;
  }
}

module.exports = Registrar;
