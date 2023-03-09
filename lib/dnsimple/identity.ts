import type Client = require("./client");
import type { RequestOptions } from "./request";

/**
 * Provides access to the DNSimple Identity API.
 *
 * @see https://developer.dnsimple.com/v2/identity
 */
class Identity {
  constructor(private readonly _client: Client) {}

  /**
   * Gets the information about the current authenticated context.
   *
   * @see https://developer.dnsimple.com/v2/identity/#whoami
   *
   * @param {Object} [options]
   * @return {Promise}
   */
  whoami (options: RequestOptions = {}) {
    return this._client.get('/whoami', options);
  }
}

export = Identity;
