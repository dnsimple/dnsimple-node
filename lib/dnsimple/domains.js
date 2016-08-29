'use strict';

class Domains {
  constructor(client) {
    this._client = client;
  }

  listDomains(accountId, options, callback) {
    this._client.get('/' + accountId + '/domains', options, callback);
  }

  domain(accountId, domainId, options, callback) {
    this._client.get('/' + accountId + '/domains/' + domainId, options, callback);
  }

  createDomain(accountId, attributes, options, callback) {
    this._client.post('/' + accountId + '/domains', attributes, options, callback);
  }

  deleteDomain(accountId, domainId, options, callback) {
    this._client.delete('/' + accountId + '/domains/' + domainId, options, callback);
  }

  resetDomainToken(accountId, domainId, options, callback) {
    this._client.post('/' + accountId + '/domains/' + domainId + '/token', null, options, callback);
  }
}

module.exports = Domains;
