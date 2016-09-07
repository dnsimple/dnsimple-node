'use strict';

const Paginate = require('./paginate');

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
   * Lists ALL available one-click services.
   *
   * This method is similar to {#listServices}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List one-click services
   * client.services.allServices().then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List one-click services, provide a sorting policy
   * client.services.allServices({sort: 'name:asc'}).then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allServices(options = {}) {
    return new Paginate(this).paginate(this.listServices, [options]);
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
   * List ALL the applied services in the domain.
   *
   * This method is similar to {#appliedServices}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all applied services
   * client.domains.allAppliedServices(1010, 'example.com').then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List all applied services, provide a sorting policy
   * client.domains.allAppliedServices(1010, 'example.com', {sort: 'name:asc'}).then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allAppliedServices(accountId, domainId, options = {}) {
    return new Paginate(this).paginate(this.appliedServices, [accountId, domainId, options]);
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
