'use strict';

class Zones {
  constructor(client) {
    this._client = client;
  }

  listZones(accountId, options = {}) {
    return this._client.get('/' + accountId + '/zones', options);
  }

  getZone(accountId, zoneName, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneName, options);
  }

  getZoneFile(accountId, zoneName, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneName + '/file', options);
  }

  listRecords(accountId, zoneName, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneName + '/records', options);
  }

  getRecord(accountId, zoneName, recordId, options = {}) {
    return this._client.get('/' + accountId + '/zones/' + zoneName + '/records/' + recordId, options);
  }

  createRecord(accountId, zoneName, attributes, options = {}) {
    return this._client.post('/' + accountId + '/zones/' + zoneName + '/records', attributes, options);
  }

  updateRecord(accountId, zoneName, recordId, attributes, options = {}) {
    return this._client.patch('/' + accountId + '/zones/' + zoneName + '/records/' + recordId, attributes, options);
  }

  deleteRecord(accountId, zoneName, recordId, options = {}) {
    return this._client.delete('/' + accountId + '/zones/' + zoneName + '/records/' + recordId, options);
  }
}

module.exports = Zones;
