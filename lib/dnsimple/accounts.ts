import type Client = require("./client");
import type { RequestOptions } from "./request";

/**
 * Provides access to the DNSimple Accounts API.
 *
 * @see https://developer.dnsimple.com/v2/accounts
 */
class Accounts {
  constructor(private readonly _client: Client) {}

  /**
   * Lists the accounts the authenticated entity has access to.
   *
   * @see https://developer.dnsimple.com/v2/accounts#list
   *
   * @param {Object} [options]
   * @return {Promise}
   */
  listAccounts (options: RequestOptions = {}) {
    return this._client.get('/accounts', options);
  }
}

export = Accounts;
