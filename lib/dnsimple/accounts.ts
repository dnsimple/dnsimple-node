import type Client = require("./client");
import type { RequestOptions } from "./request";

class Accounts {
  constructor(private readonly _client: Client) {}

  /**
   * Lists the accounts the current authenticated entity has access to.
   *
   * GET /accounts
   *
   * @param options Query parameters
   */
  listAccounts = (() => {
    const method = (
      options: RequestOptions & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        email: string;
        plan_identifier: string;
        created_at: string;
        updated_at: string;
      }>;
    }> => this._client.request("GET", `/accounts`, null, options);
    return method;
  })();
}
export = Accounts;
