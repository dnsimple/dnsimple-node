import type Client from "./client";
import type { RequestOptions } from "./request";
import paginate from "./paginate";

export default class SecondaryDns {
  constructor(private readonly _client: Client) {}

  /**
   * List the primary servers in the account.
   *
   * This API is paginated. Call `listPrimaryServers.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/secondary_dns/primaries
   *
   * @param account The account id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is ascending by id.
   */
  listPrimaryServers = (() => {
    const method = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        account_id: number;
        name: string;
        ip: string;
        port: number;
        linked_secondary_zones: Array<string>;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/secondary_dns/primaries`,
        null,
        options
      );
    method.paginate = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
    ) => paginate((page) => method(account, { ...options, page } as any));
    return method;
  })();

  /**
   * Creates a primary server into the account.
   *
   * POST /{account}/secondary_dns/primaries
   *
   * @param account The account id
   * @param options Query parameters
   */
  createPrimaryServer = (() => {
    const method = (
      account: number,
      data: { name: string; ip: string; port: string },
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        ip: string;
        port: number;
        linked_secondary_zones: Array<string>;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/secondary_dns/primaries`,
        data,
        options
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing primary server.
   *
   * GET /{account}/secondary_dns/primaries/{primaryserver}
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param options Query parameters
   */
  getPrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        ip: string;
        port: number;
        linked_secondary_zones: Array<string>;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/secondary_dns/primaries/${primaryserver}`,
        null,
        options
      );
    return method;
  })();

  /**
   * Permanently deletes a primary server.
   *
   * DELETE /{account}/secondary_dns/primaries/{primaryserver}
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param options Query parameters
   */
  removePrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/secondary_dns/primaries/${primaryserver}`,
        null,
        options
      );
    return method;
  })();

  /**
   * Link the primary server to a secondary zone.
   *
   * PUT /{account}/secondary_dns/primaries/{primaryserver}/link
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param options Query parameters
   */
  linkPrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        ip: string;
        port: number;
        linked_secondary_zones: Array<string>;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "PUT",
        `/${account}/secondary_dns/primaries/${primaryserver}/link`,
        null,
        options
      );
    return method;
  })();

  /**
   * Unlink the primary server from a secondary zone.
   *
   * PUT /{account}/secondary_dns/primaries/{primaryserver}/unlink
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param options Query parameters
   */
  unlinkPrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        ip: string;
        port: number;
        linked_secondary_zones: Array<string>;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "PUT",
        `/${account}/secondary_dns/primaries/${primaryserver}/unlink`,
        null,
        options
      );
    return method;
  })();

  /**
   * Creates a secondary zone into the account.
   *
   * POST /{account}/secondary_dns/zones
   *
   * @param account The account id
   * @param options Query parameters
   */
  createSecondaryZone = (() => {
    const method = (
      account: number,
      data: { name: string },
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        reverse: boolean;
        secondary: boolean;
        last_transferred_at: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/secondary_dns/zones`,
        data,
        options
      );
    return method;
  })();
}
