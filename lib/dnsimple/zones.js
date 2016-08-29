'use strict';

class Zones {
  constructor(client) {
    this._client = client;
  }

  listZones(accountId, options = {}) {
    return this._client.get('/' + accountId + '/zones', options);
  }

  zone(accountId, zoneName, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneName, options);
  }

  zone_file(accountId, zoneName, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneName + '/file', options);
  }
}

module.exports = Zones;
