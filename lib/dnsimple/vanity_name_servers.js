'use strict';

class VanityNameServers {
  constructor(client) {
    this._client = client;
  }

  enableVanityNameServers(accountId, domainId, options = {}) {
    return this._client.put(`/${accountId}/vanity/${domainId}`, null, options);
  }

  disableVanityNameServers(accountId, domainId, options = {}) {
    return this._client.delete(`/${accountId}/vanity/${domainId}`, options);
  }
}

module.exports = VanityNameServers;
