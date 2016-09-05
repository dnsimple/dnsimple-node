'use strict';

/**
 * Provides access to the DNSimple one-click Services API.
 *
 * @see https://developer.dnsimple.com/v2/services
 */
class Services {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the available one-click services.
   *
   * @see https://developer.dnsimple.com/v2/services/#list
   *
   * @example List one-click services in the first page
   * client.services.listServices().then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List one-click services, provide a specific page
   * client.services.listServices({page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List one-click services, provide a sorting policy
   * client.services.listServices({sort: 'name:asc'}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  listServices(options = {}) {
    return this._client.get('/services', options);
  }

  /**
   * Get a specific service by ID.
   *
   * @see https://developer.dnsimple.com/v2/services/#get
   *
   * @param {number} serviceId The service ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getService(serviceId, options = {}) {
    return this._client.get(`/services/${serviceId}`, options);
  }

  /**
   * Lists the one-click services applied to the domain.
   *
   * @see https://developer.dnsimple.com/v2/services/domains/#applied
   *
   * @example List applied one-click services for example.com
   * client.services.appliedServices(1010, 'example.com').then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List applied one-click services for example.com, provide a specific page
   * client.services.appliedServices(1010, 'example.com', {page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List applied one-click services for example.com, provide a sorting policy
   * client.services.appliedServices(1010, 'example.com', {sort: 'email:asc'}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or ID.
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  appliedServices(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/services`, options);
  }

  /**
   * Apply the given one-click service to the given domain.
   *
   * @see https://developer.dnsimple.com/v2/services/domains/#apply
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or ID.
   * @param {number} serviceId The service ID
   * @param {Object} [options]
   * @return {Promise}
   */
  applyService(accountId, domainId, serviceId, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/services/${serviceId}`, null, options);
  }

  /**
   * Unapply the given one-click service from the given domain.
   *
   * @see https://developer.dnsimple.com/v2/services/domains/#unapply
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or ID.
   * @param {number} serviceId The service ID
   * @param {Object} [options]
   * @return {Promise}
   */
  unapplyService(accountId, domainId, serviceId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/services/${serviceId}`, options);
  }
}

module.exports = Services;
