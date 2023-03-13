import type Client = require("./client");
import type { RequestOptions } from "./request";

class Identity {
  constructor(private readonly _client: Client) {}

  /**
   * Retrieves the details about the current authenticated entity used to access the API.
   *
   * GET /whoami
   *
   * @param options Query parameters
   */
  whoami = (() => {
    const method = (
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        account: {
          id: number;
          email: string;
          plan_identifier: string;
          created_at: string;
          updated_at: string;
        };
        user: {
          id: number;
          email: string;
          created_at: string;
          updated_at: string;
        };
      };
    }> => this._client.request("GET", `/whoami`, null, options);
    return method;
  })();
}
export = Identity;
