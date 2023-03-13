import type DNSimple from "./main";
import type { QueryParams } from "./main";
import paginate from "./paginate";

export default class Domains {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the domains in the account.
   *
   * This API is paginated. Call `listDomains.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/domains
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.name_like Only include results with a name field containing the given string
   * @param params.registrant_id Only include results with the registrant_id field matching the given value
   * @param params.sort Sort results. Default sorting is ascending by name.
   */
  listDomains = (() => {
    const method = (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?: string;
      } = {}
    ): Promise<{
      data: Array<{
        id: number;
        account_id: number;
        registrant_id: number | null;
        name: string;
        unicode_name: string;
        state: string;
        auto_renew: boolean;
        private_whois: boolean;
        expires_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/${account}/domains`, null, params);
    method.paginate = (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?: string;
      } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    return method;
  })();

  /**
   * Creates a domain and the corresponding zone into the account.
   *
   * POST /{account}/domains
   *
   * @param account The account id
   * @param params Query parameters
   */
  createDomain = (() => {
    const method = (
      account: number,
      data: { name: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        registrant_id: number | null;
        name: string;
        unicode_name: string;
        state: string;
        auto_renew: boolean;
        private_whois: boolean;
        expires_at: string | null;
        created_at: string;
        updated_at: string;
      };
    }> => this._client.request("POST", `/${account}/domains`, data, params);
    return method;
  })();

  /**
   * Retrieves the details of an existing domain.
   *
   * GET /{account}/domains/{domain}
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomain = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        registrant_id: number | null;
        name: string;
        unicode_name: string;
        state: string;
        auto_renew: boolean;
        private_whois: boolean;
        expires_at: string | null;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Permanently deletes a domain from the account.
   *
   * DELETE /{account}/domains/{domain}
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  deleteDomain = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}`,
        null,
        params
      );
    return method;
  })();
}
