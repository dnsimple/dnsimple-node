import type { DNSimple, QueryParams } from "./main";
import type * as types from "./types";

export class Identity {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Retrieves the details about the current authenticated entity used to access the API.
   *
   * GET /whoami
   *
   * @see https://developer.dnsimple.com/v2/identity/#whoami
   *
   * @param params Query parameters
   */
  whoami = (() => {
    const method = (params: QueryParams & {} = {}): Promise<{ data: { account: types.Account; user: types.User } }> => this._client.request("GET", `/whoami`, null, params);
    return method;
  })();
}
