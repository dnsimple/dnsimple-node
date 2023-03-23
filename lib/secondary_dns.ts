import type * as types from "./types";
import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class SecondaryDns {
  constructor(private readonly _client: DNSimple) {}

  /**
   * List the primary servers in the account.
   *
   * This API is paginated. Call `listPrimaryServers.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listPrimaryServers.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/secondary_dns/primaries
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#listPrimaryServers
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is ascending by id.
   */
  listPrimaryServers = (() => {
    const method = (
      account: number,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<types.PrimaryServer>;
      pagination: types.Pagination;
    }> =>
      this._client.request(
        "GET",
        `/${account}/secondary_dns/primaries`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      params: QueryParams & { sort?: string } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & { sort?: string } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Creates a primary server into the account.
   *
   * POST /{account}/secondary_dns/primaries
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#createPrimaryServer
   *
   * @param account The account id
   * @param params Query parameters
   */
  createPrimaryServer = (() => {
    const method = (
      account: number,
      data: Partial<{ name: string; ip: string; port: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.PrimaryServer }> =>
      this._client.request(
        "POST",
        `/${account}/secondary_dns/primaries`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing primary server.
   *
   * GET /{account}/secondary_dns/primaries/{primaryserver}
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#getPrimaryServer
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param params Query parameters
   */
  getPrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.PrimaryServer }> =>
      this._client.request(
        "GET",
        `/${account}/secondary_dns/primaries/${primaryserver}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Permanently deletes a primary server.
   *
   * DELETE /{account}/secondary_dns/primaries/{primaryserver}
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#removePrimaryServer
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param params Query parameters
   */
  removePrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/secondary_dns/primaries/${primaryserver}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Link the primary server to a secondary zone.
   *
   * PUT /{account}/secondary_dns/primaries/{primaryserver}/link
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#linkPrimaryServer
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param params Query parameters
   */
  linkPrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.PrimaryServer }> =>
      this._client.request(
        "PUT",
        `/${account}/secondary_dns/primaries/${primaryserver}/link`,
        null,
        params
      );
    return method;
  })();

  /**
   * Unlink the primary server from a secondary zone.
   *
   * PUT /{account}/secondary_dns/primaries/{primaryserver}/unlink
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#unlinkPrimaryServer
   *
   * @param account The account id
   * @param primaryserver The primary server id
   * @param params Query parameters
   */
  unlinkPrimaryServer = (() => {
    const method = (
      account: number,
      primaryserver: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.PrimaryServer }> =>
      this._client.request(
        "PUT",
        `/${account}/secondary_dns/primaries/${primaryserver}/unlink`,
        null,
        params
      );
    return method;
  })();

  /**
   * Creates a secondary zone into the account.
   *
   * POST /{account}/secondary_dns/zones
   *
   * @see https://developer.dnsimple.com/v2/secondary-dns/#createSecondaryZone
   *
   * @param account The account id
   * @param params Query parameters
   */
  createSecondaryZone = (() => {
    const method = (
      account: number,
      data: Partial<{ name: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Zone }> =>
      this._client.request(
        "POST",
        `/${account}/secondary_dns/zones`,
        data,
        params
      );
    return method;
  })();
}
