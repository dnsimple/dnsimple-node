'use strict';

/**
 * Provides access to the DNSimple Accounts API.
 *
 * @see https://developer.dnsimple.com/v2/accounts
 */
class Accounts {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the accounts the authenticated entity has access to.
   *
   * @see https://developer.dnsimple.com/v2/accounts#list
   *
   * @param {Object} [options]
   * @return {Promise}
   */
  listAccounts(options = {}) {
    return this._client.get('/accounts', options);
  }
}

module.exports = Accounts;
