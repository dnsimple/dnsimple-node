import type { DNSimple, QueryParams } from "./main";

export class Accounts {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the accounts the current authenticated entity has access to.
   *
   * GET /accounts
   *
   * @see https://developer.dnsimple.com/v2/accounts/#listAccounts
   *
   * @param params Query parameters
   */
  listAccounts = (() => {
    const method = (
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        email: string;
        plan_identifier: string;
        created_at: string;
        updated_at: string;
      }>;
    }> => this._client.request("GET", `/accounts`, null, params);
    return method;
  })();
}
