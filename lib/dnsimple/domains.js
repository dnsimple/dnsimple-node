'use strict';

class Domains {
  constructor(client) {
    this._client = client;
  }

  listDomains(accountId, options = {}) {
    return this._client.get(`/${accountId}/domains`, options);
  }

  getDomain(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}`, options);
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

  listEmailForwards(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/email_forwards`, options);
  }

  getEmailForward(accountId, domainId, emailForwardId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/email_forwards/${emailForwardId}`, options);
  }

  createEmailForward(accountId, domainId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/email_forwards`, attributes, options);
  }

  deleteEmailForward(accountId, domainId, emailForwardId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/email_forwards/${emailForwardId}`, options);
  }
}

module.exports = Domains;
