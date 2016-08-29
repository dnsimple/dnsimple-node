'use strict';

class Zones {
  constructor(client) {
    this._client = client;
  }

  listZones(accountId, options = {}) {
    return this._client.get('/' + accountId + '/zones', options);
  }

  zone(accountId, zoneId, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneId, options);
  }
}

module.exports = Zones;
