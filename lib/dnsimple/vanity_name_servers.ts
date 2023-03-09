import type Client = require("./client");
import type { RequestOptions } from "./request";

/**
 * Provides access to the  DNSimple Vanity Name Server API
 *
 * @see https://developer.dnsimple.com/v2/domains/vanity
 */
class VanityNameServers {
  constructor(private readonly _client: Client) {}

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
  enableVanityNameServers (accountId, domainId, options: RequestOptions = {}) {
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
  disableVanityNameServers (accountId, domainId, options: RequestOptions = {}) {
    return this._client.delete(`/${accountId}/vanity/${domainId}`, options);
  }
}

export = VanityNameServers;
