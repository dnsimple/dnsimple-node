import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Services {
  constructor(private readonly _client: DNSimple) {}

  /**
   * List all available one-click services.
   *
   * This API is paginated. Call `listServices.iterateAll(params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listServices.collectAll(params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /services
   *
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id ascending.
   */
  listServices = (() => {
    const method = (
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        name: string;
        sid: string;
        description: string;
        setup_description: string | null;
        requires_setup: boolean;
        default_subdomain: string | null;
        created_at: string;
        updated_at: string;
        settings: Array<{
          name: string;
          label: string;
          append: string;
          description: string;
          example: string;
          password?: boolean;
        }>;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/services`, null, params);
    method.iterateAll = (params: QueryParams & { sort?: string } = {}) =>
      paginate((page) => method({ ...params, page } as any));
    method.collectAll = async (
      params: QueryParams & { sort?: string } = {}
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
   * @param service The service sid or id
   * @param params Query parameters
   */
  getService = (() => {
    const method = (
      service: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        name: string;
        sid: string;
        description: string;
        setup_description: string | null;
        requires_setup: boolean;
        default_subdomain: string | null;
        created_at: string;
        updated_at: string;
        settings: Array<{
          name: string;
          label: string;
          append: string;
          description: string;
          example: string;
          password?: boolean;
        }>;
      };
    }> => this._client.request("GET", `/services/${service}`, null, params);
    return method;
  })();

  /**
   * List services applied to a domain.
   *
   * This API is paginated. Call `listDomainAppliedServices.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listDomainAppliedServices.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/services
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  listDomainAppliedServices = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        name: string;
        sid: string;
        description: string;
        setup_description: string | null;
        requires_setup: boolean;
        default_subdomain: string | null;
        created_at: string;
        updated_at: string;
        settings: Array<{
          name: string;
          label: string;
          append: string;
          description: string;
          example: string;
          password?: boolean;
        }>;
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
        `/${account}/domains/${domain}/services`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ) => {
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
   * @param account The account id
   * @param domain The domain name or id
   * @param service The service sid or id
   * @param params Query parameters
   */
  applyServiceToDomain = (() => {
    const method = (
      account: number,
      domain: string,
      service: string,
      data: {},
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/services/${service}`,
        data,
        params
      );
    return method;
  })();

  /**
   * Unapplies a service from a domain.
   *
   * DELETE /{account}/domains/{domain}/services/{service}
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param service The service sid or id
   * @param params Query parameters
   */
  unapplyServiceFromDomain = (() => {
    const method = (
      account: number,
      domain: string,
      service: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/services/${service}`,
        null,
        params
      );
    return method;
  })();
}
