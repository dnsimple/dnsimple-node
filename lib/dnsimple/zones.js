'use strict';

class Zones {
  constructor(client) {
    this._client = client;
  }

  listZones(accountId, options = {}) {
    return this._client.get(`/${accountId}/zones`, options);
  }

  getZone(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}`, options);
  }

  getZoneFile(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/file`, options);
  }

  listRecords(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/records`, options);
  }

  getRecord(accountId, zoneId, recordId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/records/${recordId}`, options);
  }

  createRecord(accountId, zoneId, attributes, options = {}) {
    return this._client.post(`/${accountId}/zones/${zoneId}/records`, attributes, options);
  }

  updateRecord(accountId, zoneId, recordId, attributes, options = {}) {
    return this._client.patch(`/${accountId}/zones/${zoneId}/records/${recordId}`, attributes, options);
  }

  deleteRecord(accountId, zoneId, recordId, options = {}) {
    return this._client.delete(`/${accountId}/zones/${zoneId}/records/${recordId}`, options);
  }
}

module.exports = Zones;
