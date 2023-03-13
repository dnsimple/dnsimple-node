import type DNSimple from "./main";
import type { QueryParams } from "./main";

export default class Tlds {
  constructor(private readonly _client: DNSimple) {}

  /**
   * ListsTLDs supported for registration or transfer.
   *
   * GET /tlds
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
        registration_enabled: boolean;
        renewal_enabled: boolean;
        transfer_enabled: boolean;
        dnssec_interface_type: string;
      }>;
    }> => this._client.request("GET", `/tlds`, null, params);
    return method;
  })();

  /**
   * Retrieves the details of a TLD.
   *
   * GET /tlds/{tld}
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
