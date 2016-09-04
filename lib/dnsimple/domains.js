'use strict';

class Domains {
  constructor(client) {
    this._client = client;
  }

  listDomains(accountId, options = {}) {
    return this._client.get(`/${accountId}/domains`, options);
  }

  getDomain(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/` + domainId, options);
  }

  createDomain(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains`, attributes, options);
  }

  deleteDomain(accountId, domainId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}`, options);
  }

  resetDomainToken(accountId, domainId, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/token`, null, options);
  }
}

module.exports = Domains;
