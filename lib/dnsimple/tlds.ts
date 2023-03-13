import type Client from "./client";
import type { RequestOptions } from "./request";

export default class Tlds {
  constructor(private readonly _client: Client) {}

  /**
   * ListsTLDs supported for registration or transfer.
   *
   * GET /tlds
   *
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by tld ascending.
   */
  listTlds = (() => {
    const method = (
      options: RequestOptions & { sort?: string } = {}
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
    }> => this._client.request("GET", `/tlds`, null, options);
    return method;
  })();

  /**
   * Retrieves the details of a TLD.
   *
   * GET /tlds/{tld}
   *
   * @param tld The TLD string
   * @param options Query parameters
   */
  getTld = (() => {
    const method = (
      tld: string,
      options: RequestOptions & {} = {}
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
    }> => this._client.request("GET", `/tlds/${tld}`, null, options);
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
   * @param options Query parameters
   */
  getTldExtendedAttributes = (() => {
    const method = (
      tld: string,
      options: RequestOptions & {} = {}
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
        options
      );
    return method;
  })();
}
