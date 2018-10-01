'use strict';

const Paginate = require('./paginate');

/**
 * Provides access to the DNSimple Zone API.
 *
 * @see https://developer.dnsimple.com/v2/zones/
 */
class Zones {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the zones in the account.
   *
   * @see https://developer.dnsimple.com/v2/zones/#list
   *
   * @example List zones in the first page
   * client.zones.listZones(1010).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List zones, provide a specific page
   * client.zones.listZones(1010, {page: 2}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List zones, provide a sorting policy
   * client.zones.listZones(1010, {sort: 'name:asc'}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List zones, provide a filtering policy
   * client.zones.listZones(1010, {name_like: 'example'}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @param {string} [options.name_like] Filter zones where the name is like the given string
   * @return {Promise}
   */
  listZones(accountId, options = {}) {
    return this._client.get(`/${accountId}/zones`, options);
  }

  /**
   * List ALL the zones in the account.
   *
   * This method is similar to {#listZones}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all zones
   * client.zones.allZones(1010).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List zones, provide a sorting policy
   * client.zones.allZones(1010, {sort: 'name:asc'}).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List zones, provide a filtering policy
   * client.zones.allZones(1010, {name_like: 'example'}).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @param {string} [options.name_like] Filter zones where the name is like the given string
   * @return {Promise}
   */
  allZones(accountId, options = {}) {
    return new Paginate(this).paginate(this.listZones, [accountId, options]);
  }

  /**
   * Get a specific zone associated to an account using the zone's name or ID.
   *
   * @see https://developer.dnsimple.com/v2/zones/#get
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getZone(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}`, options);
  }

  /**
   * Get the zone file associated to an account using the zone's name or ID.
   *
   * @see https://developer.dnsimple.com/v2/zones/#get-file
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getZoneFile(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/file`, options);
  }

  /**
   * Checks if a zone change is fully distributed to all our nameservers of our regions.
   *
   * @see https://developer.dnsimple.com/v2/zones/#checkZoneDistribution
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  checkZoneDistribution(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/distribution`, options);
  }

  /**
   * Checks if a zone record is fully distributed to all our nameservers of our regions.
   *
   * @see https://developer.dnsimple.com/v2/zones/#checkZoneRecordDistribution
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {number} recordId The record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  checkZoneRecordDistribution(accountId, zoneId, recordId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/records/${recordId}/distribution`, options);
  }

  /**
   * Lists the records in the zone.
   *
   * @see https://developer.dnsimple.com/v2/zones/records/#list
   *
   * @example List records in zone, first page
   * client.zones.listRecords(1010, 'example.com').then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List records in zone, provide a specific page
   * client.zones.listRecords(1010, 'example.com', {page: 2}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List records in zone, provide a sorting policy
   * client.zones.listRecords(1010, 'example.com', {sort: 'name:asc'}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  listZoneRecords(accountId, zoneId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/records`, options);
  }

  /**
   * List ALL the records in the zone.
   *
   * This method is similar to {#listRecords}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all records
   * client.zones.allZoneRecords(1010, 'example.com').then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List all records, provide a sorting policy
   * client.zones.allZoneRecords(1010, 'example.com', {sort: 'name:asc'}).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allZoneRecords(accountId, zoneId, options = {}) {
    return new Paginate(this).paginate(this.listZoneRecords, [accountId, zoneId, options]);
  }

  /**
   * Get a specific record associated to a zone using the zone's name or ID.
   *
   * @see https://developer.dnsimple.com/v2/zones/records/#get
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {number} recordId The record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getZoneRecord(accountId, zoneId, recordId, options = {}) {
    return this._client.get(`/${accountId}/zones/${zoneId}/records/${recordId}`, options);
  }

  /**
   * Create a record in a zone.
   *
   * @see https://developer.dnsimple.com/v2/zones/records/#create
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {Object} attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createZoneRecord(accountId, zoneId, attributes, options = {}) {
    return this._client.post(`/${accountId}/zones/${zoneId}/records`, attributes, options);
  }

  /**
   * Update a record in a zone.
   *
   * @see https://developer.dnsimple.com/v2/zones/records/#update
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {number} recordId The record ID
   * @param {Object} attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  updateZoneRecord(accountId, zoneId, recordId, attributes, options = {}) {
    return this._client.patch(`/${accountId}/zones/${zoneId}/records/${recordId}`, attributes, options);
  }

  /**
   * Delete a record from a zone.
   *
   * @see https://developer.dnsimple.com/v2/zones/records/#delete
   *
   * @param {number} accountId The account ID
   * @param {string|number} zoneId The zone name or numeric ID
   * @param {number} recordId The record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteZoneRecord(accountId, zoneId, recordId, options = {}) {
    return this._client.delete(`/${accountId}/zones/${zoneId}/records/${recordId}`, options);
  }
}

module.exports = Zones;
