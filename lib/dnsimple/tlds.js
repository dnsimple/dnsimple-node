'use strict';

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
  getExtendedAttributes(tld, options = {}) {
    return this._client.get(`/tlds/${tld}/extended_attributes`, options);
  }

}

module.exports = Tlds;
