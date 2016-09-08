'use strict';

const Paginate = require('./paginate');

/**
 * Provides access to the DNSimple TLD API.
 *
 * @see https://developer.dnsimple.com/v2/tlds
 */
class Tlds {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the TLDs available for registration.
   *
   * @see https://developer.dnsimple.com/v2/tlds/#list
   *
   * @example List TLDs in the first page
   * client.tlds.listTlds().then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List TLDs, provide a specific page
   * client.tlds.listTlds({page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List TLDs, provide a sorting policy
  * client.tlds.listTlds({sort: 'tld:asc'}).then(function(response) {
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
  listTlds(options = {}) {
    return this._client.get('/tlds', options);
  }

  /**
   * List ALL the TLDs available.
   *
   * This method is similar to {#listTlds}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all TLDs
   * client.tlds.allTlds().then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List all TLDs, provide a sorting policy
   * client.tlds.allTlds({sort: 'name:asc'}).then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allTlds(options = {}) {
    return new Paginate(this).paginate(this.listTlds, [options]);
  }


  /**
   * Get details for a TLD.
   *
   * @see https://developer.dnsimple.com/v2/tlds/#get
   *
   * @example Get information on a specific TLD
   * client.tlds.getTld('com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {string} tld The TLD name
   * @param {Object} [options]
   * @return {Promise}
   */
  getTld(tld, options = {}) {
    return this._client.get(`/tlds/${tld}`, options);
  }

  /**
   * Get extended attributes for a TLD.
   *
   * @see https://developer.dnsimple.com/v2/tlds/#extended-attributes
   *
   * @example Get extended attributes for a specific TLD
   * client.tlds.getExtendedAttributes('uk').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {string} tld The TLD name
   * @param {Object} [options]
   * @return {Promise}
   */
  getTldExtendedAttributes(tld, options = {}) {
    return this._client.get(`/tlds/${tld}/extended_attributes`, options);
  }

}

module.exports = Tlds;
