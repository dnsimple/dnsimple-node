'use strict';

/**
 * Provides access to the DNSimple Identity API.
 *
 * @see https://developer.dnsimple.com/v2/identity
 */
class Identity {
  constructor(client) {
    this._client = client;
  }

  /**
   * Gets the information about the current authenticated context.
   *
   * @see https://developer.dnsimple.com/v2/identity/#whoami
   *
   * @param {Object} [options]
   * @return {Promise}
   */
  whoami(options = {}) {
    return this._client.get('/whoami', options);
  }
}

module.exports = Identity;
