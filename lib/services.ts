import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";
import type * as types from "./types";

export class Services {
  constructor(private readonly _client: DNSimple) {}

  /**
   * List all available one-click services.
   *
   * This API is paginated. Call `listServices.iterateAll(params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listServices.collectAll(params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /services
   *
   * @see https://developer.dnsimple.com/v2/services/#listServices
   *
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id ascending.
   */
  listServices = (() => {
    const method = (
      params: QueryParams & {
        sort?: "id:asc" | "id:desc" | "sid:asc" | "sid:desc";
      } = {}
    ): Promise<{ data: Array<types.Service>; pagination: types.Pagination }> => this._client.request("GET", `/services`, null, params);
    method.iterateAll = (
      params: QueryParams & {
        sort?: "id:asc" | "id:desc" | "sid:asc" | "sid:desc";
      } = {}
    ) => paginate((page) => method({ ...params, page } as any));
    method.collectAll = async (
      params: QueryParams & {
        sort?: "id:asc" | "id:desc" | "sid:asc" | "sid:desc";
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Retrieves the details of a one-click service.
   *
   * GET /services/{service}
   *
   * @see https://developer.dnsimple.com/v2/services/#getService
   *
   * @param service The service sid or id
   * @param params Query parameters
   */
  getService = (() => {
    const method = (service: string, params: QueryParams & {} = {}): Promise<{ data: types.Service }> => this._client.request("GET", `/services/${service}`, null, params);
    return method;
  })();

  /**
   * List services applied to a domain.
   *
   * This API is paginated. Call `applyService.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await applyService.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/services
   *
   * @see https://developer.dnsimple.com/v2/services/#listDomainAppliedServices
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  applyService = (() => {
    const method = (account: number, domain: string, params: QueryParams & {} = {}): Promise<{ data: Array<types.Service>; pagination: types.Pagination }> => this._client.request("GET", `/${account}/domains/${domain}/services`, null, params);
    method.iterateAll = (account: number, domain: string, params: QueryParams & {} = {}) => paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (account: number, domain: string, params: QueryParams & {} = {}) => {
      const items = [];
      for await (const item of method.iterateAll(account, domain, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Applies a service to a domain.
   *
   * POST /{account}/domains/{domain}/services/{service}
   *
   * @see https://developer.dnsimple.com/v2/services/#applyServiceToDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param service The service sid or id
   * @param params Query parameters
   */
  appliedServices = (() => {
    const method = (account: number, domain: string, service: string, data: Partial<{}>, params: QueryParams & {} = {}): Promise<{}> => this._client.request("POST", `/${account}/domains/${domain}/services/${service}`, data, params);
    return method;
  })();

  /**
   * Unapplies a service from a domain.
   *
   * DELETE /{account}/domains/{domain}/services/{service}
   *
   * @see https://developer.dnsimple.com/v2/services/#unapplyServiceFromDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param service The service sid or id
   * @param params Query parameters
   */
  unapplyService = (() => {
    const method = (account: number, domain: string, service: string, params: QueryParams & {} = {}): Promise<{}> => this._client.request("DELETE", `/${account}/domains/${domain}/services/${service}`, null, params);
    return method;
  })();
}
