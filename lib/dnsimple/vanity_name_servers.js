'use strict';

/**
 * Provides access to the  DNSimple Vanity Name Server API
 *
 * @see https://developer.dnsimple.com/v2/domains/vanity
 */
class VanityNameServers {
  constructor(client) {
    this._client = client;
  }

  /**
   * Enable vanity name servers for the domain
   *
   * @see https://developer.dnsimple.com/v2/domains/vanity/#enable
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain ID or name
   * @param {Object} [options]
   * @return {Promise}
   */
  enableVanityNameServers(accountId, domainId, options = {}) {
    return this._client.put(`/${accountId}/vanity/${domainId}`, null, options);
  }

  /**
   * Disable vanity name servers for the domain
   *
   * @see https://developer.dnsimple.com/v2/domains/vanity/#disable
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain ID or name
   * @param {Object} [options]
   * @return {Promise}
   */
  disableVanityNameServers(accountId, domainId, options = {}) {
    return this._client.delete(`/${accountId}/vanity/${domainId}`, options);
  }
}

module.exports = VanityNameServers;
