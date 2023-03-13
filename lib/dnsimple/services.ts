import type Client = require("./client");
import type { RequestOptions } from "./request";
import paginate = require("./paginate");
class Services {
  constructor(private readonly _client: Client) {}

  /**
   * List all available one-click services.
   *
   * This API is paginated. Call `listServices.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /services
   *
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id ascending.
   */
  listServices = (() => {
    const method = (
      options: RequestOptions & {
        sort?: string;
      } = {}
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
          password: boolean;
        }>;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/services`, null, options);
    method.paginate = (
      options: RequestOptions & {
        sort?: string;
      } = {}
    ) => paginate((page) => method({ ...options, page } as any));
    return method;
  })();

  /**
   * Retrieves the details of a one-click service.
   *
   * GET /services/{service}
   *
   * @param service The service sid or id
   * @param options Query parameters
   */
  getService = (() => {
    const method = (
      service: string,
      options: RequestOptions & {} = {}
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
          password: boolean;
        }>;
      };
    }> => this._client.request("GET", `/services/${service}`, null, options);
    return method;
  })();

  /**
   * List services applied to a domain.
   *
   * This API is paginated. Call `listDomainAppliedServices.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/domains/{domain}/services
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  listDomainAppliedServices = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
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
          password: boolean;
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
        options
      );
    method.paginate = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
    ) =>
      paginate((page) => method(account, domain, { ...options, page } as any));
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
   * @param options Query parameters
   */
  applyServiceToDomain = (() => {
    const method = (
      account: number,
      domain: string,
      service: string,
      data: {},
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/services/${service}`,
        data,
        options
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
   * @param options Query parameters
   */
  unapplyServiceFromDomain = (() => {
    const method = (
      account: number,
      domain: string,
      service: string,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/services/${service}`,
        null,
        options
      );
    return method;
  })();
}
export = Services;
