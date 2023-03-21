import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Tlds {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists TLDs supported for registration or transfer.
   *
   * This API is paginated. Call `listTlds.iterateAll(params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listTlds.collectAll(params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /tlds
   *
   * @see https://developer.dnsimple.com/v2/tlds/#listTlds
   *
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by tld ascending.
   */
  listTlds = (() => {
    const method = (
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        tld: string;
        tld_type: number;
        whois_privacy: boolean;
        auto_renew_only: boolean;
        idn: boolean;
        minimum_registration: number;
        registration_enabled: boolean;
        renewal_enabled: boolean;
        transfer_enabled: boolean;
        dnssec_interface_type: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/tlds`, null, params);
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
   * Retrieves the details of a TLD.
   *
   * GET /tlds/{tld}
   *
   * @see https://developer.dnsimple.com/v2/tlds/#getTld
   *
   * @param tld The TLD string
   * @param params Query parameters
   */
  getTld = (() => {
    const method = (
      tld: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        tld: string;
        tld_type: number;
        whois_privacy: boolean;
        auto_renew_only: boolean;
        idn: boolean;
        minimum_registration: number;
        registration_enabled: boolean;
        renewal_enabled: boolean;
        transfer_enabled: boolean;
        dnssec_interface_type: string;
      };
    }> => this._client.request("GET", `/tlds/${tld}`, null, params);
    return method;
  })();

  /**
   * Lists a TLD extended attributes.
   *
   * Some TLDs require extended attributes when registering or transferring a domain. This API interface provides information on the extended attributes for any particular TLD. Extended attributes are extra TLD-specific attributes, required by the TLD registry to collect extra information about the registrant or legal agreements.
   *
   * GET /tlds/{tld}/extended_attributes
   *
   * @see https://developer.dnsimple.com/v2/tlds/#getTldExtendedAttributes
   *
   * @param tld The TLD string
   * @param params Query parameters
   */
  getTldExtendedAttributes = (() => {
    const method = (
      tld: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        name: string;
        description: string;
        required: boolean;
        options: Array<{ title: string; value: string; description: string }>;
      }>;
    }> =>
      this._client.request(
        "GET",
        `/tlds/${tld}/extended_attributes`,
        null,
        params
      );
    return method;
  })();
}
