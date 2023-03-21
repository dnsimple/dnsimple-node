import type { DNSimple, QueryParams } from "./main";

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
    const method = (
      params: QueryParams & {} = {}
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
    }> => this._client.request("GET", `/whoami`, null, params);
    return method;
  })();
}
