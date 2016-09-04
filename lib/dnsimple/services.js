'use strict';

class Services {
  constructor(client) {
    this._client = client;
  }

  listServices(options = {}) {
    return this._client.get('/services', options);
  }

  getService(name, options = {}) {
    return this._client.get(`/services/${name}`, options);
  }

  appliedServices(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/services`, options);
  }

  applyService(accountId, domainId, serviceId, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/services/${serviceId}`, null, options);
  }

  unapplyService(accountId, domainId, serviceId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/services/${serviceId}`, options);
  }
}

module.exports = Services;
